import { memo, useState } from 'react';
import { View, Image, Button } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { startLoading, endLoading, getDateTime, confirm } from '../../tools/util';

import './index.scss';

interface ImageProps {
  fileID: string;
  tempFileURL: string;
}

interface PickerPorps {
  placeholder?: string;
  value?: any[];
  maxlength?: number;
  preview?: boolean;
  onChange: (arr: ImageProps[]) => void;
}

const cloudUploadFile = (filePath: string, cb: (e: any) => void) => {
  Taro.cloud.uploadFile({
    cloudPath: `images/${getDateTime('string')}`,
    filePath, // 文件路径
    success: cb,
    fail: cb,
  });
};

const Upload = (props: PickerPorps) => {
  const { value = [], preview = false, maxlength = 5, onChange } = props;
  const [files, setFiles] = useState<ImageProps[]>(value);

  const updateImageValue = (arr: ImageProps[]) => {
    setFiles(arr);
    onChange(arr);
  };

  // 上传图片
  const uploadImage = () => {
    let fileIndex = 0;
    const fileIDs: any = []; // 上传成功fileId集合
    Taro.chooseImage({
      count: maxlength,
      success: (res: any) => {
        startLoading();
        const cloudCallback = (e) => {
          if (e.fileID) {
            fileIDs.push(e.fileID);
            fileIndex += 1;
            if (fileIndex < fileIDs.length) {
              cloudUploadFile(res.tempFilePaths[fileIndex], cloudCallback);
            } else {
              Taro.cloud.getTempFileURL({
                fileList: fileIDs,
                success: (tres) => {
                  const newFiles = tres.fileList.map(({ fileID, tempFileURL }) => ({ fileID, tempFileURL }));
                  updateImageValue(newFiles);
                  endLoading();
                },
              });
            }
          }
        };
        cloudUploadFile(res.tempFilePaths[fileIndex], cloudCallback);
      },
    });
  };

  // 删除图片
  const deleteImage = (fileID: string) => {
    confirm('确定删除此照片？', () => {
      startLoading();
      Taro.cloud.deleteFile({
        fileList: [fileID],
        success: (res) => {
          const newFiles = files.filter((f: ImageProps) => {
            const hasArr = res.fileList.map(({ fileID: hasFileID }) => hasFileID);
            return !hasArr.includes(f.fileID);
          });
          updateImageValue(newFiles);
          endLoading();
        },
      });
    });
  };

  return (
    <View className='custom-upload'>
      {files?.map((file: ImageProps, inx: number) => (
        <View
          className='custom-upload-item'
          key={file.fileID}
          onClick={() => {
            Taro.previewImage({
              urls: files.map(({ tempFileURL }) => tempFileURL),
              current: files[inx].tempFileURL,
            });
          }}
        >
          <Image className='perview' src={file.tempFileURL} mode='widthFix' />
          {!preview && (
            <Button
              className='remove'
              onClick={(e: any) => {
                e.stopPropagation();
                deleteImage(files[inx].fileID);
              }}
            >
              删除
            </Button>
          )}
        </View>
      ))}
      {files?.length < maxlength && !preview ? <View className='custom-upload-item upload-add' onClick={uploadImage} /> : null}
    </View>
  );
};

export default memo(Upload);
