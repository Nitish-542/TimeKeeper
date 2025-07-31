import React from "react";

import { BiMailSend, BiPhoneCall, BiSupport } from "react-icons/bi";
import LayoutTheme from "../components/Layout/LayoutTheme";

const ShippingPage = () => {
  return (
    <LayoutTheme title={"Shipping"}>
      <div className='container'>
        <div className='my-5 p-2'>
          <h1 className='mb-4'>Shipping And Return Policy</h1>
          <div className='text-start'>
            <div>
              <h2 className='text-black mb-2'>DOMESTIC SHIPPING</h2>
              <p className='text-justify mt-2'>
                Delivery within Chandigarh takes 1-3 working days while deliveries
                outside Chandigarh but within India takes 4-6 working days.
              </p>
            </div>
            <div>
              <h2 className='text-black mb-2'>INTERNATIONAL SHIPPING</h2>
              <p className='text-justify mt-2'>
                All international orders are fulfilled by DHL so they are
                trackable. Delivery time for international orders is 5-7 working
                days after order placement.
              </p>
            </div>
            <div>
              <h2 className='text-black mb-2'>RETURN POLICY</h2>
              <p className='text-justify mt-2'>
                Item(s) are subject to RETURN/EXCHANGE/REFUND if if TimeKeeper
                receives the item/s within:
              </p>
              <ul>
                <li>
                  3 business days from date of delivery/Pick Up for orders
                  placed within Chandigarh{" "}
                </li>
                <li>
                  5 business days from date of delivery for orders placed within
                  India but outside Chandigarh
                </li>
                <li>
                  The item(s) MUST physically be in our possession within the
                  above time frame for the item to qualify for an exchange or
                  refund. There are no exceptions to this rule.
                </li>
              </ul>
            </div>
            <div className='mt-4'>
              <h2 className='text-black mb-2'>RETURN ADDRESS:</h2>
              <p className='text-justify mt-2'>939 Phase 11. Mohali, Chandigarh</p>
            </div>
          </div>
        </div>
      </div>
    </LayoutTheme>
  );
};

export default ShippingPage;
