import { Injectable, NotFoundException } from '@nestjs/common';

import { LotsService } from 'src/lots/lots.service';
import { ProductsService } from 'src/products/products.service';
import { CustomersService } from 'src/customers/customers.service';
import { DeliveryNotesService } from 'src/delivery-notes/delivery-notes.service';
import { DeliveryNoteDetail } from 'src/delivery-note-details/schema/deliverynotedetail.schema';
import { DeliveryNoteDetailsService } from 'src/delivery-note-details/delivery-note-details.service';
import { WeightsService } from 'src/weights/weights.service';

@Injectable()
export class SuggestionsService {
  constructor(
    private readonly lotsService: LotsService,
    private readonly weightsService: WeightsService,
    private readonly productsService: ProductsService,
    private readonly customersService: CustomersService,
    private readonly deliveryNotesService: DeliveryNotesService,
    private readonly deliveryNoteDetailsService: DeliveryNoteDetailsService,
  ) {}

  private norm(value: number, maxValue: number): number {
    if (!maxValue || maxValue <= 0) return 0;
    const n = value / maxValue;
    return Math.min(Math.max(n, 0), 1);
  }

  // GET /v1/products/export-product/:customerId
  async exportProductByCustomerId({ customerId }: { customerId: string }) {
    const weightActive = await this.weightsService.findOne({
      filter: { active: true },
    });
    if (!weightActive) throw new NotFoundException('Weight not found');

    const w1 = weightActive.w1;
    const w2 = weightActive.w2;
    const w3 = weightActive.w3;

    const customerExists = await this.customersService.findOne({
      filter: { _id: customerId },
    });
    if (!customerExists) throw new NotFoundException('Customer not found');

    const customerDeliveryNotes = await this.deliveryNotesService.find({
      filter: { customerId },
    });
    const customerDeliveryNoteIds = customerDeliveryNotes.map(
      (deliveryNote) => deliveryNote._id,
    );

    let customerDetails: DeliveryNoteDetail[] = [];
    if (customerDeliveryNoteIds.length > 0) {
      customerDetails = await this.deliveryNoteDetailsService.find({
        filter: { deliveryNoteId: { $in: customerDeliveryNoteIds } },
      });
    }

    const customerLotIds = Array.from(
      new Set(
        customerDetails
          .map((customerDetail) => customerDetail.lotId)
          .filter(Boolean),
      ),
    );

    const customerLots =
      customerLotIds.length > 0
        ? await this.lotsService.find({
            filter: { _id: { $in: customerLotIds } },
          })
        : [];

    const lotIdToProductMap = new Map<string, string>();
    for (const lot of customerLots) {
      lotIdToProductMap.set(lot.id as string, lot.productId);
    }

    const customerQtyMap = new Map<string, number>();
    for (const customerDetail of customerDetails) {
      const lotId = customerDetail.lotId;
      const productId = lotIdToProductMap.get(lotId);
      if (!productId) continue;
      const q = customerDetail.quantity ?? 0;
      customerQtyMap.set(productId, (customerQtyMap.get(productId) ?? 0) + q);
    }

    const customerProductIds = Array.from(customerQtyMap.keys());
    const customerProductTypeSet = new Set<string>();
    if (customerProductIds.length > 0) {
      const boughtProducts = await this.productsService.find({
        filter: { _id: { $in: customerProductIds } },
      });
      for (const p of boughtProducts) {
        if (p.productTypeId) customerProductTypeSet.add(p.productTypeId);
      }
    }

    const allDetails: DeliveryNoteDetail[] =
      await this.deliveryNoteDetailsService.find({ filter: {} });
    const allLotIds = Array.from(
      new Set(allDetails.map((allDetail) => allDetail.lotId).filter(Boolean)),
    );
    const allLotsForStock = await this.lotsService.find({ filter: {} });
    const lotsForDetails =
      allLotIds.length > 0
        ? await this.lotsService.find({ filter: { _id: { $in: allLotIds } } })
        : [];
    const allLotIdToProductMap = new Map<string, string>();
    for (const lotForDetail of lotsForDetails) {
      allLotIdToProductMap.set(
        lotForDetail.id as string,
        lotForDetail.productId,
      );
    }

    const globalQtyMap = new Map<string, number>();
    for (const d of allDetails) {
      const productId = allLotIdToProductMap.get(d.lotId);
      if (!productId) continue;
      const q = d.quantity ?? 0;
      globalQtyMap.set(productId, (globalQtyMap.get(productId) ?? 0) + q);
    }

    const stockMap = new Map<string, number>();
    for (const l of allLotsForStock) {
      const pid = l.productId;
      stockMap.set(pid, (stockMap.get(pid) ?? 0) + (l.quantity ?? 0));
    }

    const allProducts = await this.productsService.find({
      filter: { status: 'active' },
    });

    const maxCustomerQty = Math.max(0, ...Array.from(customerQtyMap.values()));
    const maxGlobalQty = Math.max(0, ...Array.from(globalQtyMap.values()));

    const suggestions = allProducts
      .map((p) => {
        const pid = p.id as string;
        const customer_qty = customerQtyMap.get(pid) ?? 0;
        const global_qty = globalQtyMap.get(pid) ?? 0;
        const stock_qty = stockMap.get(pid) ?? 0;

        // <-- BỎ LỌC stock_qty <= 0 để tất cả product xuất hiện -->
        // nếu bạn muốn vẫn loại out-of-stock, uncomment dòng dưới:
        // if ((stock_qty ?? 0) <= 0) return null;

        const boughtBefore = customer_qty > 0;
        const sameTypeFlag =
          !boughtBefore &&
          p.productTypeId &&
          customerProductTypeSet.has(p.productTypeId)
            ? 1
            : 0;

        const normCustomer = this.norm(customer_qty, maxCustomerQty);
        const normGlobal = this.norm(global_qty, maxGlobalQty);

        const score = w1 * normCustomer + w2 * sameTypeFlag + w3 * normGlobal;

        const reason = boughtBefore
          ? `Bought ${customer_qty} unit(s)`
          : sameTypeFlag
            ? `Same type as customer's purchases`
            : `Popular product`;

        return {
          productId: pid,
          name: p.name,
          productTypeId: p.productTypeId,
          stock_qty,
          customer_qty,
          global_qty,
          sameTypeFlag,
          score,
          reason,
        };
      })
      .filter(Boolean) as Array<any>;

    suggestions.sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      if ((b.customer_qty ?? 0) !== (a.customer_qty ?? 0))
        return (b.customer_qty ?? 0) - (a.customer_qty ?? 0);
      return (b.global_qty ?? 0) - (a.global_qty ?? 0);
    });

    return {
      customerId,
      weights: { w1, w2, w3 },
      schemaImagePath: '/mnt/data/3d4adff0-88e9-4c94-a1fa-86dc8965751d.png', // đường dẫn file bạn đã upload
      suggestions: suggestions.slice(0, 100),
    };
  }
}
