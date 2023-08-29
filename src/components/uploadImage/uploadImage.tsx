import React, { useState } from 'react';
import { CroppedFile, SelectedFile, Uploader3, UploadFile, UploadResult } from '@lxdao/uploader3';
import { Icon } from '@iconify/react';

import { createConnector } from '@lxdao/uploader3-connector';

import { Typography } from '@mui/material';

import { PreviewFile, PreviewWrapper } from '@/components/uploadImage/preview';

export default function UploadImage() {
	const [file, setFile] = useState<SelectedFile | UploadFile | UploadResult | CroppedFile | null>(
		null,
	);

	const connector = createConnector('NFT.storage', {
		token: process.env.NEXT_PUBLIC_NFT_STORAGE_TOKEN as string,
	});

	return (
		<div style={{ padding: 10 }}>
			<Typography>Avatar</Typography>
			<Uploader3
				connector={connector}
				multiple={false}
				onChange={(files) => {
					setFile(files[0]);
				}}
				onUpload={(file) => {
					setFile(file);
				}}
				onComplete={(file) => {
					setFile(file);
					console.log('onComplete file', file);
				}}
				onCropCancel={(file) => {
					setFile(null);
				}}
				onCropEnd={(file) => {
					setFile(file);
				}}
			>
				<PreviewWrapper style={{ height: 200, width: 200 }}>
					{file ? (
						<PreviewFile file={file} />
					) : (
						<span>
							<Icon
								icon={'material-symbols:cloud-upload'}
								color={'#65a2fa'}
								fontSize={60}
							/>
						</span>
					)}
				</PreviewWrapper>
			</Uploader3>
		</div>
	);
}
