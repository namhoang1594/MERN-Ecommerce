import { Request, Response } from "express";
import { addAddressService, deleteAddressService, getAddressesService, setDefaultAddressService, updateAddressService } from "../../services/shop/address.service";

export const getAddresses = async (req: Request, res: Response) => {
  try {
    const addresses = await getAddressesService(req.user!._id);
    res.json({ success: true, data: addresses });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
}

export const addAddress = async (req: Request, res: Response) => {
  try {
    const { fullName, phone, street, ward, province } = req.body;

    // Validate required fields
    if (!fullName || !phone || !street || !ward || !province) {
      return res.status(400).json({
        success: false,
        message: "All address fields are required"
      });
    }

    const address = await addAddressService(req.user!._id, req.body);
    res.json({ success: true, data: address });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
}

export const updateAddress = async (req: Request, res: Response) => {
  try {
    const address = await updateAddressService(
      req.user!._id,
      req.params.id,
      req.body
    );
    res.json({ success: true, data: address });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
}

export const deleteAddress = async (req: Request, res: Response) => {
  try {
    await deleteAddressService(req.user!._id, req.params.id);
    res.json({ success: true, message: "Address deleted successfully" });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
}

export const setDefaultAddress = async (req: Request, res: Response) => {
  try {
    const address = await setDefaultAddressService(
      req.user!._id,
      req.params.id
    );
    res.json({ success: true, data: address });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
}

