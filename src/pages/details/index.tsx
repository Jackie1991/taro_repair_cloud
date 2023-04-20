import React, { useEffect } from 'react';
import Taro from '@tarojs/taro';
import CustomForm from '../../components/Form';

import './index.scss';

const Booking = () => {
  const loginInfo = Taro.getStorageSync('loginInfo');
  const details = Taro.getStorageSync('repairDetails');

  const dataMap = () => {
    const repairStatus = ['待处理', '进行中', '待评价', '已完成'];
    const data = { ...details, ...loginInfo };
    data.status = repairStatus[data.status];
    return data;
  };

  useEffect(() => {
    return () => {
      Taro.removeStorageSync('repairDetails');
    };
  }, []);

  return (
    <CustomForm
      className='details-warpper'
      value={dataMap()}
      fields={[
        {
          label: '报修设备',
          name: 'device'
        },
        {
          label: '状态',
          name: 'status'
        },
        {
          label: '维修人',
          name: 'repair'
        },
        {
          label: '维修电话',
          name: 'repairNumber'
        },
        {
          label: '联系人',
          name: 'contact'
        },
        {
          label: '联系电话',
          name: 'contactNumber'
        },
        {
          label: '所在学校',
          name: 'school'
        },
        {
          label: '设备位置',
          name: 'location'
        },
        {
          label: '报修时间',
          name: 'createTime'
        },
        {
          label: '报修情况',
          name: 'situation',
          itemMode: 'column'
        },
        {
          label: '报修图片',
          name: 'imgs',
          type: 'image',
          itemMode: 'column',
          maxlength: 2
        }
      ].map((e: any) => ({
        ...e,
        preview: true
      }))}
    />
  );
};

export default Booking;
