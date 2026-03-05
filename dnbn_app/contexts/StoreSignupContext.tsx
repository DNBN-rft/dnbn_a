/**
 * 스토어 회원가입 Context
 * 
 * 5단계 회원가입 플로우의 전역 상태 관리
 * - 각 단계별 formData 저장
 * - 단계 간 데이터 공유
 * - 초기화 기능
 */
import React, { createContext, useContext, useState, ReactNode } from 'react';
import {
  AgreementData,
  MemberInfoData,
  BizInfoData,
  StoreInfoData,
  FileUploadData,
  StoreSignupFormData,
} from '@/types/store-signup.types';

interface StoreSignupContextType {
  formData: StoreSignupFormData;
  updateAgreement: (data: Partial<AgreementData>) => void;
  updateMemberInfo: (data: Partial<MemberInfoData>) => void;
  updateBizInfo: (data: Partial<BizInfoData>) => void;
  updateStoreInfo: (data: Partial<StoreInfoData>) => void;
  updateFileUpload: (data: Partial<FileUploadData>) => void;
  resetFormData: () => void;
  currentStep: number;
  setCurrentStep: (step: number) => void;
}

/**
 * 초기 formData 상태
 */
const initialFormData: StoreSignupFormData = {
  agreement: {
    terms: false,
    privacy: false,
    seller: false,
    marketing: false,
  },
  memberInfo: {
    loginId: '',
    password: '',
    email: '',
  },
  bizInfo: {
    ownerNm: '',
    ownerTelNo: '',
    bizNm: '',
    bizNo: '',
    bizRegDate: '',
    bizType: '',
    storeAccNo: '',
    bankId: '',
  },
  storeInfo: {
    storeNm: '',
    storeTelNo: '',
    storeZipCode: '',
    storeAddr: '',
    storeDetailAddr: '',
    storeOpenDate: [],
    storeOpenTime: '',
    storeCloseTime: '',
    storeType: '',
  },
  fileUpload: {
    storeImage: null,
    businessDocs: [],
  },
};

const StoreSignupContext = createContext<StoreSignupContextType | undefined>(undefined);

/**
 * StoreSignupProvider 컴포넌트
 */
export function StoreSignupProvider({ children }: { children: ReactNode }) {
  const [formData, setFormData] = useState<StoreSignupFormData>(initialFormData);
  const [currentStep, setCurrentStep] = useState<number>(0);

  /**
   * 약관 동의 데이터 업데이트
   */
  const updateAgreement = (data: Partial<AgreementData>) => {
    setFormData((prev) => ({
      ...prev,
      agreement: {
        ...prev.agreement,
        ...data,
      },
    }));
  };

  /**
   * 회원 정보 데이터 업데이트
   */
  const updateMemberInfo = (data: Partial<MemberInfoData>) => {
    setFormData((prev) => ({
      ...prev,
      memberInfo: {
        ...prev.memberInfo,
        ...data,
      },
    }));
  };

  /**
   * 사업자 정보 데이터 업데이트
   */
  const updateBizInfo = (data: Partial<BizInfoData>) => {
    setFormData((prev) => ({
      ...prev,
      bizInfo: {
        ...prev.bizInfo,
        ...data,
      },
    }));
  };

  /**
   * 가맹점 정보 데이터 업데이트
   */
  const updateStoreInfo = (data: Partial<StoreInfoData>) => {
    setFormData((prev) => ({
      ...prev,
      storeInfo: {
        ...prev.storeInfo,
        ...data,
      },
    }));
  };

  /**
   * 파일 업로드 데이터 업데이트
   */
  const updateFileUpload = (data: Partial<FileUploadData>) => {
    setFormData((prev) => ({
      ...prev,
      fileUpload: {
        ...prev.fileUpload,
        ...data,
      },
    }));
  };

  /**
   * formData 초기화
   */
  const resetFormData = () => {
    setFormData(initialFormData);
    setCurrentStep(0);
  };

  return (
    <StoreSignupContext.Provider
      value={{
        formData,
        updateAgreement,
        updateMemberInfo,
        updateBizInfo,
        updateStoreInfo,
        updateFileUpload,
        resetFormData,
        currentStep,
        setCurrentStep,
      }}
    >
      {children}
    </StoreSignupContext.Provider>
  );
}

/**
 * StoreSignupContext 사용 훅
 */
export function useStoreSignup() {
  const context = useContext(StoreSignupContext);
  if (context === undefined) {
    throw new Error('useStoreSignup must be used within a StoreSignupProvider');
  }
  return context;
}
