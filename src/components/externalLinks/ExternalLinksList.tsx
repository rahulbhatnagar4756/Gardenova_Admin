import type { ExternalLinksListProps } from "../../types/externalLinks";

/**
 * ExternalLinksList component.
 *
 * Renders a table of external links with actions to edit, delete,
 * and toggle active status.
 *
 * @param props Component props
 * @param props.links List of external links to display
 * @param props.onEdit Callback fired when edit action is triggered
 * @param props.onDelete Callback fired when delete action is triggered
 * @param props.onToggleStatus Callback fired when link status is toggled
 *
 * @returns JSX element displaying external links table
 */
const ExternalLinksList = ({
  links,
  onEdit,
  onDelete,
  onToggleStatus,
}: ExternalLinksListProps & {
  onToggleStatus: (id: string, isActive: boolean) => void;
}) => {
  if (links.length === 0) {
    return <p className="text-center">No external links found.</p>;
  }

  return (
    <div className="table-responsive">
      <table className="subscription-table">
        <thead>
          <tr>
            {/* <th>#</th> */}
            <th>Title</th>
            <th>Link</th>
            <th>Status</th>
            <th className="text-end">Actions</th>
          </tr>
        </thead>

        <tbody>
          {links.map((link) => (
            <tr key={link.id}>
              {/* <td>{index + 1}</td> */}

              <td>{link.title}</td>

              <td>
                <a href={link.url || ""} target="_blank" rel="noreferrer" className="link_underline">
                  {link.url || ""}
                </a>
              </td>

              <td>
                <label className="switch">
                  <input
                    type="checkbox"
                    checked={link.is_active}
                    onChange={() =>
                      onToggleStatus(link.id, !link.is_active)
                    }
                  />
                  <span className="slider" />
                </label>
              </td>

              <td className="text-end">
                <button className="icon-btn edit" onClick={() => onEdit(link)}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width={22}
                    height={22}
                    viewBox="0 0 22 22"
                    fill="none"
                  >
                    <path
                      d="M19.3357 6.17264L15.5812 2.41896C15.2661 2.10396 14.8388 1.927 14.3932 1.927C13.9477 1.927 13.5204 2.10396 13.2053 2.41896L2.84486 12.7786C2.6883 12.9342 2.56417 13.1193 2.47966 13.3232C2.39515 13.5271 2.35195 13.7458 2.35255 13.9665V17.721C2.35255 18.1667 2.52957 18.594 2.84468 18.9091C3.15979 19.2243 3.58717 19.4013 4.0328 19.4013H18.1469C18.4143 19.4013 18.6707 19.2951 18.8598 19.106C19.0489 18.9169 19.1551 18.6605 19.1551 18.3931C19.1551 18.1258 19.0489 17.8693 18.8598 17.6803C18.6707 17.4912 18.4143 17.385 18.1469 17.385H10.5018L19.3357 8.54936C19.4918 8.39333 19.6156 8.20807 19.7001 8.00417C19.7846 7.80026 19.8281 7.58171 19.8281 7.361C19.8281 7.14029 19.7846 6.92174 19.7001 6.71784C19.6156 6.51394 19.4918 6.32868 19.3357 6.17264ZM7.64534 17.385H4.36885V14.1085L11.4259 7.05142L14.7024 10.3279L7.64534 17.385ZM16.1306 8.8997L12.8541 5.6232L14.3949 4.08241L17.6714 7.3589L16.1306 8.8997Z"
                      fill="#4A4A4A"
                    />
                  </svg>
                </button>

                <button
                  className="icon-btn delete"
                  onClick={() => onDelete(link.id)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                  >
                    <path
                      d="M16.9996 4.7492H3.7976C3.55887 4.7492 3.32991 4.84404 3.1611 5.01285C2.9923 5.18165 2.89746 5.41061 2.89746 5.64934C2.89746 5.88807 2.9923 6.11702 3.1611 6.28583C3.32991 6.45464 3.55887 6.54947 3.7976 6.54947H4.09764V16.751C4.09764 17.1489 4.2557 17.5305 4.53705 17.8118C4.8184 18.0932 5.19998 18.2512 5.59787 18.2512H15.1993C15.5972 18.2512 15.9788 18.0932 16.2601 17.8118C16.5415 17.5305 16.6995 17.1489 16.6995 16.751V6.54947H16.9996C17.2383 6.54947 17.4673 6.45464 17.6361 6.28583C17.8049 6.11702 17.8997 5.88807 17.8997 5.64934C17.8997 5.41061 17.8049 5.18165 17.6361 5.01285C17.4673 4.84404 17.2383 4.7492 16.9996 4.7492ZM14.8993 16.451H5.89791V6.54947H14.8993V16.451ZM6.498 2.64888C6.498 2.41015 6.59284 2.1812 6.76165 2.01239C6.93046 1.84358 7.15941 1.74875 7.39814 1.74875H13.399C13.6378 1.74875 13.8667 1.84358 14.0355 2.01239C14.2043 2.1812 14.2992 2.41015 14.2992 2.64888C14.2992 2.88762 14.2043 3.11657 14.0355 3.28538C13.8667 3.45419 13.6378 3.54902 13.399 3.54902H7.39814C7.15941 3.54902 6.93046 3.45419 6.76165 3.28538C6.59284 3.11657 6.498 2.88762 6.498 2.64888Z"
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

export default ExternalLinksList;
