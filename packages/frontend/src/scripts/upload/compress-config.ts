/*
 * SPDX-FileCopyrightText: syuilo and misskey-project
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import isAnimated from 'is-file-animated';
import { isWebpSupported } from './isWebpSupported.js';
import type { BrowserImageResizerConfigWithConvertedOutput } from '@misskey-dev/browser-image-resizer';

const compressTypeMap = {
	'lossy': { quality: 0.90, mimeType: 'image/webp' },
	'lossless': { quality: 1, mimeType: 'image/webp' },
} as const;

const compressTypeMapFallback = {
	'lossy': { quality: 0.85, mimeType: 'image/jpeg' },
	'lossless': { quality: 1, mimeType: 'image/png' },
} as const;

export async function getCompressionConfig(file: File): Promise<BrowserImageResizerConfigWithConvertedOutput | undefined> {
	const imgConfig = (isWebpSupported() ? compressTypeMap : compressTypeMapFallback)[file.type];
	if (!imgConfig || await isAnimated(file)) {
		return;
	}

	return {
		debug: true,
		...imgFormatConfig,
		...sizeConfig,
	};
}
