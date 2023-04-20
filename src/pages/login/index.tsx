import { useState } from 'react';
import { View, Text, Button } from '@tarojs/components';
import Taro from '@tarojs/taro';
// import cn from 'classnames';
import CustomForm from '../../components/Form';
import { cloudFunction } from '../../tools/cloud';
import { router, showToast } from '../../tools/util';

import './index.scss';

interface RegisterProps {
  username: string;
  userphone: string;
  inviteCode: string;
  school: string;
}

const Login = () => {
  const [user, setUser] = useState<any>({});
  const [isLoginDom, setIsLoginDom] = useState<boolean>(true);
  // const [checked, setChecked] = useState<boolean>(false);
  // const [ruleTitle, setRuleTitle] = useState<string>('');

  // 用户信息回调
  const userCallback = (res: any) => {
    if (res) {
      showToast(res.message);
      if (res._id) {
        Taro.setStorage({ key: 'userInfo', data: res });
        setTimeout(() => {
          router.reLaunch('index');
        }, 1500);
      }
    }
  };

  return (
    <View className='form-container'>
      <Text className='title'>报修系统</Text>
      <View className='form-warpper'>
        {isLoginDom ? (
          <View className='type-wrapper'>
            <Text>已注册账户，点击登录</Text>
            <Button
              className='login-btn'
              onClick={() => {
                // if (!checked) {
                //   showToast('请先同意《用户服务协议》及《隐私政策》');
                //   return;
                // }
                cloudFunction({ name: 'login' }).then(userCallback);
              }}
            >
              登录
            </Button>
            <View className='line-btn' onClick={() => setIsLoginDom(false)}>
              还未注册?
            </View>
          </View>
        ) : (
          <View className='type-wrapper'>
            <CustomForm
              mode='column'
              fields={[
                {
                  label: '姓名',
                  name: 'username',
                  placeholder: '请输入姓名',
                  type: 'input',
                },
                {
                  label: '电话',
                  name: 'userphone',
                  placeholder: '请输入电话',
                  type: 'number',
                  maxlength: 11,
                  pattern: /^1[345789]\d{9}$/,
                },
                {
                  label: '邀请码',
                  name: 'inviteCode',
                  placeholder: '请输入邀请码',
                  type: 'input',
                  onBlur: (e: any) => {
                    // QiodVj
                    cloudFunction({ name: 'hasCheck', data: { inviteCode: e.detail.value } }).then((res: any) => {
                      if (res) {
                        setUser(res);
                      } else {
                        showToast('邀请码错误，请咨询客服人员确定正确的邀请码!');
                      }
                    });
                  },
                },
                {
                  label: '所在学校',
                  name: 'school',
                  placeholder: '请输入所在学校',
                  type: 'select',
                  hidden: user.userType === 2,
                  request: {
                    name: 'getDictionary',
                    param: { type: 'school' },
                  },
                },
              ].map((e: any) => ({
                ...e,
                required: true,
              }))}
              submitBtn='注册'
              onSubmit={(data: RegisterProps) => {
                // if (!checked) {
                //   showToast('请先同意《用户服务协议》及《隐私政策》');
                //   return;
                // }
                const userInfo = Taro.getStorageSync('userInfo');
                cloudFunction({ name: 'login', data: { ...user, ...userInfo, ...data } }).then(userCallback);
              }}
            />
            <View className='line-btn' onClick={() => setIsLoginDom(true)}>
              已注册，去登录
            </View>
          </View>
        )}
        {/* <View className='user-agreement' onClick={() => setChecked(!checked)}>
          <View className={cn('check', checked && 'checked')}></View>
          同意
          <View
            onClick={(e) => {
              e.stopPropagation();
              setRuleTitle('《用户服务协议》');
            }}
          >
            《用户服务协议》
          </View>
          及
          <View
            onClick={(e) => {
              e.stopPropagation();
              setRuleTitle('《隐私政策》');
            }}
          >
            《隐私政策》
          </View>
        </View> */}
      </View>
      {/* <View className={cn('agreement-modal', ruleTitle !== '' && 'show')} onClick={() => setRuleTitle('')}>
        <View className='agreement-wrapper'>
          <Text className='agreement-title'>{ruleTitle}</Text>
        </View>
      </View> */}
    </View>
  );
};

export default Login;
