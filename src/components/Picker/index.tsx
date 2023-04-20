import { useEffect, useState, memo } from 'react';
import { Text, Picker } from '@tarojs/components';
import { cloudFunction } from '../../tools/cloud';

import './index.scss';

interface requestProps {
  name: string; // 远程请求云函数名称
  param?: any; // 请求参数
  callback?: (res: any) => void; // 请求回调
}

interface PickerPorps {
  value?: string | number;
  options?: any[]; // 静态数据
  request?: requestProps;
  name?: string;
  placeholder?: string;
  onChange?: (e: any) => void;
}

const CustomForm = (props: PickerPorps) => {
  const { options = [], request, name, value, placeholder = '请选择', onChange } = props;
  const [range, setRange] = useState<any[]>(options);

  // 远程获取列表
  useEffect(() => {
    if (request) {
      cloudFunction({ name: request.name, data: { ...request.param } }).then((res: any) => {
        const resOptions = request.callback ? request.callback(res) : res;
        setRange(resOptions.map(({ label }) => label));
      });
    }
  }, [request]);

  return (
    <Picker
      className={`select ${value && 'selected'}`}
      mode='selector'
      name={name}
      range={range}
      value={value ? range.indexOf(value) : 0}
      onChange={(e) => {
        const index = e.detail.value; // 选中的下标
        onChange && onChange(range[index]);
      }}
    >
      <Text>{range?.filter((e) => e === value)[0] || placeholder}</Text>
    </Picker>
  );
};

export default memo(CustomForm);
