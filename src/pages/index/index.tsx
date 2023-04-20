import { useState, useMemo } from 'react';
import { View, ScrollView, Text, Button } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { router, confirm, showToast, getDateTime } from '../../tools/util';
import { cloudFunction } from '../../tools/cloud';

import './index.scss';

interface itemProps {
  _id: string;
  device: string;
  location: string;
  createTime: string;
  status: number;
  repair: string;
  finishTime: string;
}

// 状态文本 根据下标对应状态
const repairStatus = ['待处理', '进行中', '待评价', '已完成'];
const statusClass = ['todo', 'doing', 'tobe', 'done'];

// 状态按钮 s传入按钮状态
interface BtnProps {
  status: number;
  _id: string;
  query?: string;
  update: (e: number) => void;
}
const BtnRender = (props: BtnProps) => {
  const { status, _id, query, update } = props;
  const userInfo = Taro.getStorageSync('userInfo');
  const userType = userInfo.userType; // 用户权限
  const btnTitle = {
    1: ['取消', null, '评价'], // 用户
    2: ['维修', '完成'], // 维修人员
  }[userType][status];
  if (!btnTitle) return null;
  return (
    <Button
      className='action'
      size='mini'
      onClick={(e: any) => {
        e.stopPropagation();
        if (status === 2) {
          router.navigateTo('appraise?id=' + _id + '&f=' + query);
        } else {
          confirm(`是否确认${btnTitle}本次报修申请？`, () => {
            const newStatus = userType === 1 && status === 0 ? -1 : status + 1;
            const params: any = { status: newStatus, _id };
            if (userType === 2 && status === 0) {
              params.repairOpenid = userInfo.openid;
              params.repair = userInfo.username;
              params.repairNumber = userInfo.userphone;
            }
            cloudFunction({
              name: 'updateStatus',
              data: { ...params },
            }).then((res: any) => {
              if (res.code === 200) {
                showToast(`${btnTitle}成功`);
                update(newStatus);
              } else {
                showToast(res.message);
              }
            });
          });
        }
      }}
    >
      {btnTitle}
    </Button>
  );
};

const Index = () => {
  const [list, setList] = useState<any[]>([]);
  const [tabIndex, setTabIndex] = useState<number>(-1);
  const [page, setPage] = useState<number>(0); // 从0开始取
  const [total, setTotal] = useState<number>(0);
  const userInfo = Taro.getStorageSync('userInfo');

  // 获取列表
  const getRepair = () => {
    if (!userInfo) return;
    const repairParam: any = {
      page,
      userType: userInfo.userType,
    };
    if (tabIndex >= 0) {
      repairParam.status = tabIndex;
    }
    console.log(repairParam);

    cloudFunction({
      name: 'getRepair',
      data: repairParam,
    }).then((res: any) => {
      setList(res.list);
      setTotal(res.total);
    });
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useMemo(getRepair, [tabIndex, page]);

  return (
    <View className='wrapper'>
      <View className='tabs flex ac jc-sb'>
        <View
          className={`tab ${tabIndex === -1 ? 'active' : ''}`}
          onClick={() => {
            setTabIndex(-1);
            setPage(0);
          }}
        >
          全部
        </View>
        {repairStatus.map((tab: string, inx: number) => (
          <View
            className={`tab ${tabIndex === inx ? 'active' : ''}`}
            key={tab}
            onClick={() => {
              setTabIndex(inx);
              setPage(0);
            }}
          >
            {tab}
          </View>
        ))}
      </View>
      {list.length ? (
        <ScrollView
          className='repair-box'
          scrollY
          type='list'
          lowerThreshold={50}
          onScrollToLower={() => {
            if (page + 1 < total) {
              setPage(page + 10);
            }
          }}
        >
          {list.map((item: itemProps) => {
            const keys = ['device', 'location', 'createTime', 'status'];
            const labels = ['维修设备', '设备位置', '报修时间', '状态'];
            console.log(item);

            return (
              <View
                key={item._id}
                className='repair-group'
                onClick={() => {
                  Taro.setStorage({ key: 'repairDetails', data: item });
                  router.navigateTo('details');
                }}
              >
                {keys.map((k: string, i: number) => (
                  <View className='repair-item' key={item[k]}>
                    <Text className='repair-item-title'>{labels[i]}</Text>
                    {k === 'status' ? (
                      <View className={`repair-item-content flex jc-sb ${statusClass[item[k]]}`}>
                        <Text>{repairStatus[item[k]]}</Text>
                        {userInfo && (
                          <BtnRender
                            status={item[k]}
                            _id={item._id}
                            query={JSON.stringify({ repair: item.repair, finishTime: item.finishTime })}
                            update={(n) => {
                              item[k] = n;
                              getRepair();
                            }}
                          />
                        )}
                      </View>
                    ) : (
                      <Text>{k === 'createTime' ? getDateTime('datetime', item[k]) : item[k]}</Text>
                    )}
                  </View>
                ))}
              </View>
            );
          })}
        </ScrollView>
      ) : (
        <Text className='nothing'>暂无数据</Text>
      )}
      {userInfo?.userType === 1 ? <View className='repair-add' onClick={() => router.navigateTo('booking')} /> : null}
    </View>
  );
};

export default Index;
