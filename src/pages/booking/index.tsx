import Taro from '@tarojs/taro';
import CustomForm from '../../components/Form';
import { cloudFunction } from '../../tools/cloud';
import { router, showToast, confirm } from '../../tools/util';

import './index.scss';

const Booking = () => {
  const userInfo = Taro.getStorageSync('userInfo');

  const formSubmit = (v) => {
    confirm('是否确认提交本次申请？', () => {
      cloudFunction({ name: 'addBooking', data: { params: v } }).then((res: any) => {
        showToast(res.message);
        if (res.code === 200) {
          setTimeout(() => {
            router.reLaunch('index');
          }, 1500);
        }
      });
    });
  };

  return (
    <CustomForm
      className='booking-warpper'
      value={{ contact: userInfo.username, contactNumber: userInfo.userphone, school: userInfo.school }}
      fields={[
        {
          label: '报修设备',
          name: 'device',
          type: 'select',
          request: {
            name: 'getDictionary',
            param: { type: 'device' },
          },
        },
        {
          label: '设备位置',
          name: 'location',
          type: 'textarea',
        },
        {
          label: '报修情况',
          name: 'situation',
          type: 'textarea',
        },
        {
          label: '联系人',
          name: 'contact',
          type: 'text',
        },
        {
          label: '联系电话',
          name: 'contactNumber',
          type: 'text',
        },
        {
          label: '所在学校',
          name: 'school',
          type: 'text',
        },
        {
          label: '报修图片',
          name: 'imgs',
          type: 'image',
        },
      ].map((e: any) => ({
        ...e,
        required: true,
      }))}
      onSubmit={formSubmit}
    />
  );
};

export default Booking;
