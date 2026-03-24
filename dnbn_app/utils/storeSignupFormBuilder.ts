import {
    BizInfoData,
    FileUploadData,
    MemberInfoData,
    StoreInfoData,
} from "@/types/store-signup.types";

/**
 * 스토어 회원가입에 필요한 모든 데이터를 FormData로 빌드합니다.
 */
export const buildStoreSignupFormData = (
  memberInfo: MemberInfoData,
  bizInfo: BizInfoData,
  storeInfo: StoreInfoData,
  fileUpload: FileUploadData,
  fcmToken: string | null = null,
  pushSet: boolean = false,
  marketingAgreed: boolean = false,
): FormData => {
  const formData = new FormData();

  // 회원 정보
  formData.append("loginId", memberInfo.loginId);
  formData.append("password", memberInfo.password);
  formData.append("email", memberInfo.email);

  // 사업자 정보
  formData.append("ownerNm", bizInfo.ownerNm);
  formData.append("ownerTelNo", bizInfo.ownerTelNo.replace(/-/g, ""));
  formData.append("bizNm", bizInfo.bizNm);
  formData.append("bizNo", bizInfo.bizNo.replace(/-/g, ""));
  formData.append("bizRegDate", bizInfo.bizRegDate);
  formData.append("bizType", bizInfo.bizType || "");
  formData.append("storeAccNo", bizInfo.storeAccNo);
  if (bizInfo.bankId) {
    formData.append("bankId", bizInfo.bankId);
  }

  // 가게 정보
  formData.append("storeNm", storeInfo.storeNm);
  formData.append("storeTelNo", storeInfo.storeTelNo.replace(/-/g, ""));
  formData.append("storeZipCode", storeInfo.storeZipCode);
  formData.append("storeAddr", storeInfo.storeAddr);
  formData.append("storeAddrDetail", storeInfo.storeDetailAddr || "");

  // 영업일 (List<OpenDay>로 전송)
  storeInfo.storeOpenDate?.forEach((day) => {
    formData.append("storeOpenDate", day);
  });

  formData.append("storeOpenTime", storeInfo.storeOpenTime);
  formData.append("storeCloseTime", storeInfo.storeCloseTime);
  formData.append("storeType", "가맹점");

  // 약관 동의
  formData.append("agreed", "true");
  formData.append("marketingAgreed", String(marketingAgreed));
  formData.append("pushSet", String(pushSet));
  if (fcmToken) {
    formData.append("fcmToken", fcmToken);
  }

  // 가게 대표 이미지 (List<MultipartFile>로 전송)
  if (fileUpload.storeImage) {
    formData.append("storeImgFile", {
      uri: fileUpload.storeImage.uri,
      type: fileUpload.storeImage.type,
      name: fileUpload.storeImage.name,
    } as any);
  }

  // 사업자등록증 (List<MultipartFile>로 전송)
  fileUpload.businessDocs.forEach((doc) => {
    formData.append("bzFile", {
      uri: doc.uri,
      type: doc.type,
      name: doc.name,
    } as any);
  });

  return formData;
};
