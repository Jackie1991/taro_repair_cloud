import { getCurrentInstance } from '@tarojs/taro';
import CustomForm from '../../components/Form';
import { router, confirm, showToast } from '../../tools/util';
import { cloudFunction } from '../../tools/cloud';

import './index.scss';

const Appraise = () => {
  const { router: propsRouter }: any = getCurrentInstance();
  const { id, f } = propsRouter.params;
  console.log(f);

  const formSubmit = (v: any) => {
    confirm('是否确认提交评价？', () => {
      cloudFunction({
        name: 'addAppraise',
        data: { _id: id, params: v },
      }).then((res: any) => {
        if (res.code === 200) {
          router.reLaunch('index');
          showToast(res.message);
        }
      });
    });
  };

  return (
    <CustomForm
      className='appraise-warpper'
      value={JSON.parse(f)}
      fields={[
        {
          label: '维修人',
          name: 'repair',
        },
        {
          label: '完成时间',
          name: 'finishTime',
          format: 'datetime',
        },
        {
          label: '是否满意',
          name: 'satisfied',
          type: 'select',
          required: true,
          options: ['是', '否'],
        },
        {
          label: '您的评价',
          name: 'appraise',
          type: 'textarea',
        },
      ]}
      submitBtn='评价'
      onSubmit={formSubmit}
    />
  );
};

export default Appraise;
