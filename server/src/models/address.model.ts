import { Schema, model } from "mongoose";
import { IAddress } from "../types/address.types";

const AddressSchema = new Schema<IAddress>(
  {
    userId: String,
    address: String,
    city: String,
    pincode: String,
    phone: String,
    notes: String,
  },
  { timestamps: true }
);

const Address = model<IAddress>("Address", AddressSchema);

export default Address;