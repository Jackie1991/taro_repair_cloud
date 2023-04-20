import { useEffect, useState } from 'react';
import { View, Form, Input, Textarea, Text, Button } from '@tarojs/components';
import Picker from '../Picker';
import Upload from '../Upload';
import { getDateTime, formatType } from '../../tools/util';

import './index.scss';

interface FieldPorps {
  label?: string;
  name: string;
  value?: any;
  type?: 'input' | 'radio' | 'checkbox' | 'textarea' | 'number' | 'select' | 'image';
  placeholder?: string;
  required?: boolean;
  err?: string; // 校验当前字段使用，外部无需传入
  itemMode?: 'row' | 'column'; // 表单布局结构
  preview?: boolean; // 单项是否预览模式
  hidden?: boolean; // 是否隐藏

  // 私有属性
  maxlength?: number;
  pattern?: any; // 正则校验
  format?: formatType;

  // select
  options?: any[];
}

interface FieldCBProps {
  onChange: (e: any) => void;
  onBlur?: (e?: any) => void;
}

interface FormItemProps extends FieldPorps, FieldCBProps {}

interface ButtonPorps {
  label: string;
  formType?: 'submit' | 'reset';
}

interface FormPorps {
  className?: string;
  fields: FieldPorps[];
  value?: any;
  onSubmit?: (e: any) => void;
  rule?: string;
  submitBtn?: string;
  buttons?: ButtonPorps[];
  mode?: 'row' | 'column'; // 表单布局结构
}

const returnPlaceholder = (type: string | undefined, label: string | undefined) => {
  switch (type) {
    case 'input':
    case 'number':
    case 'textarea':
      return `请输入${label}`;
    case 'select':
      return `请选择${label}`;
    case 'image':
      return `请选择${label}`;
  }
};

const FormItemRender = (item: FormItemProps) => {
  const { type, onChange, onBlur, ...prop } = item;

  const changeValue = (e: any) => {
    const obj: any = {};
    if (e.detail) {
      obj[prop.name] = e.detail.value;
    } else {
      obj[prop.name] = e;
    }
    onChange(obj);
    if (onBlur) onBlur(e);
  };

  switch (type) {
    case 'input':
      return <Input {...prop} onBlur={changeValue} />;
    case 'number':
      return <Input type='number' {...prop} onBlur={changeValue} />;
    case 'textarea':
      return <Textarea {...prop} onBlur={changeValue} />;
    case 'select':
      return <Picker {...prop} onChange={changeValue} />;
    case 'image':
      return <Upload {...prop} onChange={changeValue} />;
    default:
      return <Text>{item.value}</Text>;
  }
};

const CustomForm = (props: FormPorps) => {
  const { className = '', fields, submitBtn = '提交', buttons, onSubmit, value = {}, mode = 'row' } = props;
  const [values, setValues] = useState<any>(value);
  const [fieldList, setFieldList] = useState<FieldPorps[]>(fields);

  useEffect(() => {
    setFieldList(fields);
  }, [fields]);

  const isPreviewForm = () => {
    const previewLen = fields.filter((e) => e.preview).length;
    return previewLen === fields.length;
  };

  // 提交并校验表单必填项
  const formSubmit = () => {
    const newFields = fieldList.map((f: FieldPorps) => {
      if (f.required && !f.hidden) {
        // 表单值为空
        if (!values[f.name] || (Array.isArray(values[f.name]) && values[f.name].length === 0)) {
          f.err = f.placeholder || returnPlaceholder(f.type, f.label); // 为空时提示占位文本
        } else {
          if (f.pattern && !values[f.name].match(f.pattern)) {
            f.err = '输入格式错误，请重新输入'; // 校验格式
          } else {
            f.err = undefined;
          }
        }
      }
      return f;
    });
    setFieldList(newFields);
    // 判断校验未通过
    if (newFields.filter((f: FieldPorps) => f.err).length) return;
    onSubmit && onSubmit(values);
  };

  return (
    <Form className={`custom-form ${className}`} onSubmit={formSubmit}>
      {fieldList.map((field: FieldPorps) => {
        const { label, placeholder, required, err, itemMode, preview, hidden, ...rest } = field;

        if (hidden) return null;

        const itemProps = {
          ...rest,
          value: field.format ? getDateTime(field.format, values[field.name]) : values[field.name],
          placeholder: placeholder || returnPlaceholder(rest.type, label),
          preview: !!preview,
          // 表单元素value改变输出form的value集合
          onChange: (e: any) => {
            const keyName = Object.keys(e)[0];
            const newFields = fieldList.map((item: FieldPorps) => {
              if (item.name === keyName) {
                item.err = undefined;
                item.value = e[keyName];
              }
              return item;
            });
            setValues({ ...values, ...e });
            setFieldList(newFields);
          },
        };

        return (
          <View className={`custom-form-item ${itemMode || mode} ${required ? 'custom-form-required' : ''}`} key={values[field.name]}>
            {label ? <Text className='label'>{label}</Text> : null}
            <View className={`content ${required && err ? 'error' : ''}`}>
              {FormItemRender(itemProps)}
              {required && err ? <Text className='error-tip'>{err || placeholder}</Text> : null}
            </View>
          </View>
        );
      })}
      {!isPreviewForm() ? (
        <View className='custom-buttons'>
          {buttons ? (
            buttons.map((button: ButtonPorps) => (
              <Button key={button.label} formType={button.formType}>
                {button.label}
              </Button>
            ))
          ) : (
            <Button formType='submit'>{submitBtn}</Button>
          )}
        </View>
      ) : null}
    </Form>
  );
};

export default CustomForm;
