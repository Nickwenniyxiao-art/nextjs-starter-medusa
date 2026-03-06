import React from "react"
import AddAddress from "../address-card/add-address"
import EditAddress from "../address-card/edit-address-modal"
import { HttpTypes } from "@medusajs/types"

type AddressBookProps = {
  customer: HttpTypes.StoreCustomer
  region: HttpTypes.StoreRegion
}

const AddressBook: React.FC<AddressBookProps> = ({ customer, region }) => {
  const { addresses } = customer
  return (
    <div className="w-full">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <AddAddress region={region} addresses={addresses} />
        {addresses.map((address) => {
          return (
            <EditAddress
              region={region}
              address={address}
              key={address.id}
              isDefault={Boolean(
                address.is_default_shipping || address.is_default_billing
              )}
            />
          )
        })}
      </div>
    </div>
  )
}

export default AddressBook
