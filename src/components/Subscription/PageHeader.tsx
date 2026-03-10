/**
 * Props for the PageHeader component
 */
export interface PageHeaderProps {
  title: string;
  addText: string;
  onAddClick: () => void;
  showAddButton: boolean;
}

/**
 * Page header component that displays a title
 * and optionally renders an "Add" button.
 *
 * @param root0 Component props
 * @param root0.title Page title text
 * @param root0.addText Text displayed inside the add button
 * @param root0.onAddClick Callback triggered when add button is clicked
 * @param root0.showAddButton Controls visibility of the add button
 *
 * @returns JSX element representing the page header
 */
const PageHeader = ({
  title,
  addText,
  onAddClick,
  showAddButton,
}: PageHeaderProps) => {
  return (
    <div className="main_heading_area">
      <div className="row g-3">
        <div className="col">
          <h4 className="page_heading">{title}</h4>
        </div>

        {showAddButton && (
          <div className="col-auto">
            <button
              type="button"
              className="common_button"
              onClick={onAddClick}
            >
              + {addText}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PageHeader;
