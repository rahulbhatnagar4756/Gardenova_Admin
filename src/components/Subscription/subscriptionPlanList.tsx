import type { JSX } from "react";
import type { SubscriptionPlan, SubscriptionPlansListProps } from "../../types/subscription";

/**
 * Displays a table of subscription plans with edit and status toggle actions.
 *
 * @param props Component props
 * @param props.plans List of subscription plans
 * @param props.onEdit Callback triggered when edit action is clicked
 * @param props.onToggle Callback triggered when plan status is toggled
 *
 * @returns JSX element displaying subscription plans table
 */
const SubscriptionPlansList = ({ 
  plans, 
  onEdit, 
  onToggle 
}: SubscriptionPlansListProps): JSX.Element => {
  if (plans.length === 0) {
    return <p className="text-center">No plans found</p>;
  }

  return (
    <div className="table-responsive">
      <table className="table subscription-table">
        <thead>
          <tr>
            <th>Plan Name</th>
            <th>Description</th>
            <th>Monthly Fee</th>
            <th>Annual Fee</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {plans.map((plan: SubscriptionPlan) => (
            <tr key={plan.id}>
              <td>{plan.plan_name}</td>
              <td>{plan.description}</td>
              <td>${plan.price_monthly}</td>
              <td>${plan.price_annual}</td>

              <td>
                <label className="switch">
                  <input
                    type="checkbox"
                    checked={plan.status === "active"}
                    onChange={() => onToggle(plan)}
                    aria-label={`Toggle ${plan.plan_name} status`}
                  />
                  <span className="slider round"></span>
                </label>
              </td>

              <td className="action-buttons">
                <button
                  className="btn btn-sm btn-outline-primary"
                  onClick={() => onEdit(plan)}
                  style={{ border: "none", background: "transparent" }}
                  aria-label={`Edit ${plan.plan_name}`}
                  type="button"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width={22}
                    height={22}
                    viewBox="0 0 22 22"
                    fill="none"
                    aria-hidden="true"
                  >
                    <path
                      d="M19.3357 6.17264L15.5812 2.41896C15.2661 2.10396 14.8388 1.927 14.3932 1.927C13.9477 1.927 13.5204 2.10396 13.2053 2.41896L2.84486 12.7786C2.6883 12.9342 2.56417 13.1193 2.47966 13.3232C2.39515 13.5271 2.35195 13.7458 2.35255 13.9665V17.721C2.35255 18.1667 2.52957 18.594 2.84468 18.9091C3.15979 19.2243 3.58717 19.4013 4.0328 19.4013H18.1469C18.4143 19.4013 18.6707 19.2951 18.8598 19.106C19.0489 18.9169 19.1551 18.6605 19.1551 18.3931C19.1551 18.1258 19.0489 17.8693 18.8598 17.6803C18.6707 17.4912 18.4143 17.385 18.1469 17.385H10.5018L19.3357 8.54936C19.4918 8.39333 19.6156 8.20807 19.7001 8.00417C19.7846 7.80026 19.8281 7.58171 19.8281 7.361C19.8281 7.14029 19.7846 6.92174 19.7001 6.71784C19.6156 6.51394 19.4918 6.32868 19.3357 6.17264ZM7.64534 17.385H4.36885V14.1085L11.4259 7.05142L14.7024 10.3279L7.64534 17.385ZM16.1306 8.8997L12.8541 5.6232L14.3949 4.08241L17.6714 7.3589L16.1306 8.8997Z"
                      fill="#4A4A4A"
                    />
                  </svg>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SubscriptionPlansList;