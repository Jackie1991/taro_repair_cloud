/*  我的  */
import { useRef, useState } from 'react';
import { View, Input, Image, Text, Button } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { cloudFunction } from '../../tools/cloud';
import Picker from '../../components/Picker';

import './index.scss';
import head from '../../assets/head.png';
import { showToast, getDateTime } from '../../tools/util';

const About = () => {
  const [editKey, setEditKey] = useState<string>('');
  const [errTip, setErrTip] = useState<string>('修改的内容不得为空');
  const [editValue, setEditValue] = useState<string | undefined>();
  const editInputRef = useRef<any>();
  const userInfo = Taro.getStorageSync('userInfo');
  const [avatarUrl, setAvatarUrl] = useState<string>('');

  const aboutObj = {
    username: {
      label: '姓名',
      icon: require('../../assets/icons/huiyuan.png'),
    },
    userphone: {
      label: '电话',
      icon: require('../../assets/icons/dianhua.png'),
    },
    school: {
      label: '学校',
      icon: require('../../assets/icons/dizhi.png'),
    },
  };

  return (
    <View className='wrapper'>
      <View className='infor flex ac'>
        <Button
          className='userhead'
          open-type='chooseAvatar'
          onChooseAvatar={(e: any) => {
            Taro.cloud.uploadFile({
              cloudPath: `images/head${getDateTime('string')}`,
              filePath: e.detail.avatarUrl, // 文件路径
              success: (res) => {
                Taro.cloud.getTempFileURL({
                  fileList: [res.fileID],
                  success: (tres) => {
                    cloudFunction({
                      name: 'updateUser',
                      data: {
                        params: {
                          avatarUrl: tres.fileList[0].tempFileURL,
                        },
                      },
                    }).then((result: any) => {
                      if (result.code === 200) {
                        setAvatarUrl(tres.fileList[0].tempFileURL);
                        userInfo.avatarUrl = tres.fileList[0].tempFileURL;
                        Taro.setStorage({ key: 'userInfo', data: userInfo });
                      }
                    });
                  },
                });
              },
            });
          }}
        >
          <Image src={avatarUrl || head} lazyLoad mode='widthFix' />
        </Button>
      </View>
      {Object.keys(aboutObj).map((key: string) =>
        userInfo.userType === 2 && key === 'school' ? null : (
          <View
            className='infor-item flex'
            key={userInfo[key]}
            onClick={() => {
              setEditKey(key);
            }}
          >
            <Image className='icon' src={aboutObj[key].icon} mode='aspectFill' />
            <Text className='title'>{aboutObj[key].label}</Text>
            <Text className='value'>{userInfo[key]}</Text>
          </View>
        )
      )}
      <View className={`infor-edit ${editKey ? 'show' : ''}`}>
        <View className='infor-edit-wrapper'>
          <Text className='title'>修改{aboutObj[editKey] && aboutObj[editKey].label}</Text>
          <View className='content' ref={editInputRef}>
            {editKey === 'school' ? (
              <Picker
                value={editValue || userInfo[editKey]}
                request={{
                  name: 'getDictionary',
                  param: { type: 'school' },
                }}
                onChange={setEditValue}
              />
            ) : (
              <Input
                value={editValue || userInfo[editKey]}
                type='text'
                placeholder='请输入'
                onInput={(e) => {
                  console.log(e);
                  setEditValue(e.detail.value);
                }}
                maxlength={editKey === 'userphone' ? 11 : -1}
              />
            )}
          </View>
          <Text className='err-tip'>{errTip}</Text>
          <View className='infor-edit-buttons flex ac jc-c'>
            <Button onClick={() => setEditKey('')}>取消</Button>
            <Button
              onClick={() => {
                if (editValue === '') {
                  editInputRef.current.classList.add('err');
                  setErrTip('修改的内容不得为空');
                } else if (editValue === undefined || editValue === userInfo[editKey]) {
                  editInputRef.current.classList.add('err');
                  setErrTip('修改的内容与原始内容一致');
                } else if (editKey === 'userphone' && !/^1[345789]\d{9}$/.test(editValue)) {
                  editInputRef.current.classList.add('err');
                  setErrTip('手机号输入错误，请重新输入');
                } else {
                  const { ...params } = userInfo;
                  params[editKey] = editValue;
                  cloudFunction({
                    name: 'updateUser',
                    data: {
                      params: {
                        [editKey]: editValue,
                      },
                    },
                  }).then((res: any) => {
                    if (res) {
                      if (res.code === 200) {
                        editInputRef.current.classList.remove('err');
                        Taro.setStorage({ key: 'userInfo', data: params });
                        setEditKey('');
                        setEditValue(undefined);
                        showToast('修改成功');
                      } else {
                        showToast(res.message);
                      }
                    }
                  });
                }
              }}
            >
              确定
            </Button>
          </View>
        </View>
      </View>
    </View>
  );
};

export default About;
