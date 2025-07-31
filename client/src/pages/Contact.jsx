import React from "react";

import { BiMailSend, BiPhoneCall, BiSupport } from "react-icons/bi";
import LayoutTheme from "../components/Layout/LayoutTheme";

const Contact = () => {
  return (
    <LayoutTheme title={"Contact Us"}>
      <div className='container'>
        <div className='m-5 p-2'>
          <div className='text-center '>
            <h1 className='bg-dark p-2 text-white text-center mb-4'>
              CONTACT US
            </h1>
            <p className='text-justify mt-2'>
              If you have any query and info about our product or your orders,
              feel free to contact us
            </p>
            <p className='mt-3'>
              <BiMailSend /> : www.help@timekeeper.com
            </p>
            <p className='mt-3'>
              <BiPhoneCall /> : 4376799376
            </p>
            <p className='mt-3'>
              <BiSupport /> : 1800-0000-0000 (toll free)
            </p>
          </div>
        </div>
      </div>
    </LayoutTheme>
  );
};

export default Contact;
