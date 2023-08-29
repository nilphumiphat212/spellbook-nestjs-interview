import { BaseResponse } from '../../../core/base.response';

export interface AuthResponseData {
    username: string;
    accessToken: string;
}

export interface AuthResponseDto extends BaseResponse<AuthResponseData> { }
