import { useToast } from "../../hooks/useToast";
import OptionItem from "./OptionItem";
import type { OptionsListProps } from "../../types/diagnosticQuestion";

const OptionsList = ({
  options,
  onRemove,
  onUpdate,
  editingOptionIndex,
  setEditingOptionIndex,
}: OptionsListProps) => {
  const { showWarning } = useToast();

  const handleEditStart = (index: number) => {
    if (editingOptionIndex !== null && editingOptionIndex !== index) {
      showWarning(
        "Please save the current edit before editing another option."
      );
      return;
    }
    setEditingOptionIndex(index);
  };

  const handleEditSave = (index: number, text: string) => {
    onUpdate(index, text);
    setEditingOptionIndex(null);
  };

  return (
    <div className="added_list_main_outer">
      <span className="added_label">
        <span className="added_check_icon">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width={15}
            height={16}
            viewBox="0 0 15 16"
            fill="none"
          >
            <path
              d="M7.0592 15.0592C10.9579 15.0592 14.1184 11.8987 14.1184 8C14.1184 4.10131 10.9579 0.940804 7.0592 0.940804C3.16051 0.940804 0 4.10131 0 8C0 11.8987 3.16051 15.0592 7.0592 15.0592Z"
              fill="url(#paint0_linear_611_877)"
            />
            <path
              d="M4.38379 8.40638L6.16643 10.0322L9.73168 5.96776"
              stroke="white"
              strokeWidth="1.71936"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <defs>
              <linearGradient
                id="paint0_linear_611_877"
                x1="7.0592"
                y1="0.940804"
                x2="7.0592"
                y2="15.0592"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#E0B669" />
                <stop offset={1} stopColor="#B48A3E" />
              </linearGradient>
            </defs>
          </svg>
        </span>
        Added Options
      </span>
      <ul className="added_list_main">
        {options.map((option, index) => (
          <OptionItem
            key={index}
            option={option}
            index={index}
            isEditing={editingOptionIndex === index}
            onEditStart={handleEditStart}
            onEditSave={handleEditSave}
            onRemove={onRemove}
          />
        ))}
      </ul>
    </div>
  );
};

export default OptionsList;
