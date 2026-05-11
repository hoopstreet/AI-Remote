export async function check(plan) {
  return { status: plan.length > 5 ? "APPROVED" : "REJECTED" };
}
