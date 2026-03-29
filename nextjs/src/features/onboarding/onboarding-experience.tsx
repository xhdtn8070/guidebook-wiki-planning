import { StatusPanel } from "@/shared/ui/status-panel";
import type { ViewerSession } from "@/shared/lib/api-types";
import { buildLoginHref, buildOnboardingHref } from "@/shared/lib/routes";
import { OnboardingForm } from "@/features/onboarding/onboarding-form";

type OnboardingExperienceProps = {
  viewer: ViewerSession;
  redirectTo: string | null;
  errorCode: string | null;
  action: (formData: FormData) => void | Promise<void>;
};

const errorMessages: Record<string, { title: string; description: string }> = {
  FORM_INVALID: {
    title: "필수 입력값이 비어 있습니다.",
    description: "workspace 이름과 첫 guidebook 이름은 반드시 필요합니다.",
  },
  DUPLICATE_TENANT_CODE: {
    title: "이미 사용 중인 workspace code입니다.",
    description: "다른 code를 사용하거나 이름을 조금 다르게 조정해 다시 생성하세요.",
  },
  DUPLICATE_GUIDEBOOK_CODE: {
    title: "이미 사용 중인 guidebook code입니다.",
    description: "첫 guidebook code를 다른 값으로 바꾸고 다시 시도하세요.",
  },
};

export function OnboardingExperience({ viewer, redirectTo, errorCode, action }: OnboardingExperienceProps) {
  if (!viewer.user) {
    return (
      <StatusPanel
        eyebrow="Auth"
        title="워크스페이스를 만들려면 먼저 로그인해야 합니다."
        description="onboarding은 로그인 이후 첫 tenant와 첫 guidebook을 만들기 위한 흐름입니다."
        actionHref={buildLoginHref(buildOnboardingHref(redirectTo))}
        actionLabel="로그인"
      />
    );
  }

  const errorState = errorCode ? errorMessages[errorCode] ?? { title: "워크스페이스를 생성하지 못했습니다.", description: `${errorCode} 오류가 발생했습니다. 입력값을 조정하고 다시 시도하세요.` } : null;

  return (
    <div className="space-y-6">
      {errorState ? <StatusPanel eyebrow="Create" title={errorState.title} description={errorState.description} tone="warning" /> : null}
      <OnboardingForm action={action} redirectTo={redirectTo} />
    </div>
  );
}
