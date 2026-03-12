export const PRODUCT_LIST_FIELDS =
  "id,title,handle,thumbnail,collection_id,metadata,*variants.calculated_price,+options.title,+options.values.value"

export const PRODUCT_DETAIL_FIELDS =
  "*variants.calculated_price,+variants.inventory_quantity,*variants.images,+metadata,+tags,"
