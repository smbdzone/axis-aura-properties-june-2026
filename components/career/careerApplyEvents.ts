export const CAREER_APPLY_ROLE_EVENT = "career-apply-role";

export type CareerApplyRoleDetail = {
  roleId: string;
};

export function scrollToCareerApply(roleId?: string) {
  if (roleId) {
    window.dispatchEvent(
      new CustomEvent<CareerApplyRoleDetail>(CAREER_APPLY_ROLE_EVENT, {
        detail: { roleId },
      }),
    );
  }

  document.getElementById("apply")?.scrollIntoView({
    behavior: "smooth",
    block: "start",
  });
}
