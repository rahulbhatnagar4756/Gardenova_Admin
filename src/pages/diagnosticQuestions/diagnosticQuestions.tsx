import { useState } from "react";
import "./diagnosticQuestions.css";
import { useDiagnosticQuestions } from "../../hooks/useDiagnosticQuestions";
import { DataTable } from "../../components/dataTable/dataTable";
import { Modal } from "../../components/modal/modal";
import { QuestionForm } from "../../components/questionForm/questionForm";
import { Pencil, Trash2 } from "lucide-react";
import type {
  CreateQuestionRequest,
  Question,
  UpdateQuestionRequest,
} from "../../services/apiCalls/diagnosticQuestion";
import { useNavigate } from "react-router-dom";
import { APP_ROUTES } from "../../constants/appRoutes";
import { Scale } from "lucide-react";



export const DiagnosticQuestions = ({

}) => {
 
  //   questions,
  //   loading,
  //   error,
  //   createQuestion,
  //   updateQuestion,
  //   deleteQuestion,
  // } = useDiagnosticQuestions();
  // const navigate = useNavigate();
  // const [isModalOpen, setIsModalOpen] = useState(false);
  // const [editingQuestion, setEditingQuestion] = useState<QuestionWithId | null>(
  //   null
  // );

  // const questionsWithId: QuestionWithId[] = questions.map((q, index) => ({
  //   ...q,
  //   id: index.toString(),
  // }));

  // const renderOptionsAsList = (options: string[]) => {
  //   if (!options || options.length === 0) {
  //     return <span className="no-options">No options</span>;
  //   }

  //   return (
  //     <div className="options-list">
  //       {options.map((option, index) => (
  //         <div key={index} className="option-item">
  //           <span className="option-number">{index + 1}.</span>
  //           <span className="option-text">{option}</span>
  //         </div>
  //       ))}
  //     </div>
  //   );
  // };

  // const columns = [
  //   {
  //     key: "__index",
  //     label: "Q.No. ",
  //     className: "question-column",
  //   },
  //   {
  //     key: "questionText",
  //     label: "Question",
  //     className: "question-column",
  //   },
  //   {
  //     key: "options",
  //     label: "Options",
  //     render: (_value: unknown, item: QuestionWithId) =>
  //       renderOptionsAsList(item.options),
  //     className: "options-column",
  //   },
  //   {
  //     key: "order",
  //     label: "Order",
  //     className: "order-column",
  //   },
  // ];

  // // ... rest of the component logic is the same
  // const handleEdit = (question: QuestionWithId) => {
  //   setEditingQuestion(question);
  //   setIsModalOpen(true);
  // };

  // const handleDelete = async (id: string) => {
  //   if (window.confirm("Are you sure you want to delete this question?")) {
  //     try {
  //       await deleteQuestion(id);
  //     } catch (error) {
  //       console.error("Failed to delete question:", error);
  //     }
  //   }
  // };

  // const handleSubmit = async (
  //   data: CreateQuestionRequest | UpdateQuestionRequest
  // ) => {
  //   try {
  //     if (editingQuestion) {
  //       await updateQuestion(
  //         editingQuestion._id,
  //         data as UpdateQuestionRequest
  //       );
  //     } else {
  //       await createQuestion(data as CreateQuestionRequest);
  //     }
  //     setIsModalOpen(false);
  //     setEditingQuestion(null);
  //   } catch (error) {
  //     console.error("Failed to save question:", error);
  //   }
  // };

  // const actions = [
  //   {
  //     label: "Edit",
  //     icon: <Pencil size={16} />,
  //     onClick: (item: QuestionWithId) => handleEdit(item),
  //     className: "btn-secondary",
  //   },
  //   {
  //     label: "Delete",
  //     icon: <Trash2 size={16} />,
  //     onClick: (item: QuestionWithId) => handleDelete(item._id),
  //     className: "btn-danger",
  //   },
  // ];

  // const displayedQuestions = limit
  //   ? questionsWithId.slice(0, limit)
  //   : questionsWithId;

  // const handleNavigateToRulesPage = () => {
  //   navigate(`${APP_ROUTES.admin.rules}`);
  // };

  // if (loading) return <div className="loading">Loading questions...</div>;
  // if (error) return <div className="error">Error  : {error}</div>;

  return (
    // <div className="diagnostic-page">
    //   <div className="diagnostic-header">
    //     <h2>Diagnostic Questions</h2>
    //     {!limit && (
    //       <button
    //         className="btn btn-primary"
    //         onClick={() => setIsModalOpen(true)}
    //       >
    //         Add Question
    //       </button>
    //     )}
    //     {!limit && (
    //       <button
    //         onClick={handleNavigateToRulesPage}
    //         className="btn btn-danger d-flex align-items-center gap-2 px-4 py-2 fw-semibold shadow-sm"
    //         style={{ fontSize: "16px" }}
    //       >
    //         <Scale size={16} />
    //         Manage Rules
    //       </button>
    //     )}
    //   </div>

    //   <DataTable<QuestionWithId>
    //     data={displayedQuestions}
    //     columns={columns}
    //     actions={isActionShow ? actions : undefined}
    //     emptyMessage="No diagnostic questions available"
    //   />

    //   <Modal
    //     isOpen={isModalOpen}
    //     onClose={() => {
    //       setIsModalOpen(false);
    //       setEditingQuestion(null);
    //     }}
    //     title={editingQuestion ? "Edit Question" : "Add Question"}
    //   >
    //     <QuestionForm
    //       initialData={
    //         editingQuestion
    //           ? {
    //               text: editingQuestion.questionText,
    //               options: editingQuestion.options,
    //               order: editingQuestion.order,
    //             }
    //           : undefined
    //       }
    //       onSubmit={handleSubmit}
    //       onCancel={() => {
    //         setIsModalOpen(false);
    //         setEditingQuestion(null);
    //       }}
    //     />   
    // </div>
    <>
    <div className="main_page">
      <div className="main_heading_area">
        <div className="row">
          <div className="col-md">
            <h4 className="page_heading">Manage Questions</h4>
          </div>
          <div className="col-md-auto">
            <a href="" className="common_button" data-bs-toggle="modal" data-bs-target="#exampleModal">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path fill-rule="evenodd" clip-rule="evenodd" d="M9 3C9.41421 3 9.75 3.33579 9.75 3.75V8.25H14.25C14.6642 8.25 15 8.58579 15 9C15 9.41421 14.6642 9.75 14.25 9.75H9.75V14.25C9.75 14.6642 9.41421 15 9 15C8.58579 15 8.25 14.6642 8.25 14.25V9.75H3.75C3.33579 9.75 3 9.41421 3 9C3 8.58579 3.33579 8.25 3.75 8.25H8.25V3.75C8.25 3.33579 8.58579 3 9 3Z" fill="white"/>
              </svg> Add Question
              </a>
          </div>
        </div>
      </div>
      <div className="single_question">
        <div className="row align-items-end">
          <div className="col">
<ul className="question_heading">
            <li className="question_number">Q.1</li>
            <li className="question_name">Which space do you want to transform?</li>
          </ul>
          <ul className="question_options_area">
            <li className="question_options_head">Options:</li>
            <li><span className="question_answer">Home Garden</span></li>
            <li><span className="question_answer">Apartment Balcony</span></li>
            <li><span className="question_answer">Corporate Outdoor Area</span></li>
          </ul>
          </div>
          <div className="col-auto">
            <ul className="question_options_area mt-0">
              <li className="ms-auto question_actions"><a href=""><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
  <path d="M17.8585 5.69049L14.5068 2.33949C14.2255 2.05829 13.844 1.90031 13.4463 1.90031C13.0485 1.90031 12.6671 2.05829 12.3858 2.33949L3.13677 11.5877C2.99701 11.7267 2.88619 11.8919 2.81075 12.074C2.73531 12.256 2.69674 12.4512 2.69727 12.6482V16C2.69727 16.3978 2.85531 16.7794 3.13661 17.0607C3.41792 17.342 3.79945 17.5 4.19727 17.5H16.7973C17.036 17.5 17.2649 17.4052 17.4337 17.2364C17.6025 17.0676 17.6973 16.8387 17.6973 16.6C17.6973 16.3613 17.6025 16.1324 17.4337 15.9636C17.2649 15.7948 17.036 15.7 16.7973 15.7H9.97227L17.8585 7.81224C17.9979 7.67295 18.1084 7.50756 18.1838 7.32553C18.2593 7.14351 18.2981 6.9484 18.2981 6.75137C18.2981 6.55434 18.2593 6.35923 18.1838 6.1772C18.1084 5.99518 17.9979 5.82979 17.8585 5.69049ZM7.42227 15.7H4.49727V12.775L10.7973 6.47499L13.7223 9.39999L7.42227 15.7ZM14.9973 8.12499L12.0723 5.19999L13.4478 3.82449L16.3728 6.74949L14.9973 8.12499Z" fill="#4A4A4A"/>
</svg></a></li>
<li className="question_actions delete_action">
  <a href=""><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
  <path d="M16.9996 4.7492H3.7976C3.55887 4.7492 3.32991 4.84404 3.1611 5.01285C2.9923 5.18165 2.89746 5.41061 2.89746 5.64934C2.89746 5.88807 2.9923 6.11702 3.1611 6.28583C3.32991 6.45464 3.55887 6.54947 3.7976 6.54947H4.09764V16.751C4.09764 17.1489 4.2557 17.5305 4.53705 17.8118C4.8184 18.0932 5.19998 18.2512 5.59787 18.2512H15.1993C15.5972 18.2512 15.9788 18.0932 16.2601 17.8118C16.5415 17.5305 16.6995 17.1489 16.6995 16.751V6.54947H16.9996C17.2383 6.54947 17.4673 6.45464 17.6361 6.28583C17.8049 6.11702 17.8997 5.88807 17.8997 5.64934C17.8997 5.41061 17.8049 5.18165 17.6361 5.01285C17.4673 4.84404 17.2383 4.7492 16.9996 4.7492ZM14.8993 16.451H5.89791V6.54947H14.8993V16.451ZM6.498 2.64888C6.498 2.41015 6.59284 2.1812 6.76165 2.01239C6.93046 1.84358 7.15941 1.74875 7.39814 1.74875H13.399C13.6378 1.74875 13.8667 1.84358 14.0355 2.01239C14.2043 2.1812 14.2992 2.41015 14.2992 2.64888C14.2992 2.88762 14.2043 3.11657 14.0355 3.28538C13.8667 3.45419 13.6378 3.54902 13.399 3.54902H7.39814C7.15941 3.54902 6.93046 3.45419 6.76165 3.28538C6.59284 3.11657 6.498 2.88762 6.498 2.64888Z" fill="#4A4A4A"/>
</svg></a>
</li>
            </ul>
          </div>
        </div>
          
      </div>
    </div>

    <div
  className="modal fade"
  id="exampleModal"
  tabIndex={-1}
  aria-labelledby="exampleModalLabel"
  aria-hidden="true"
>
  <div className="modal-dialog">
    <div className="modal-content">
      <div className="modal-header">
        <h1 className="modal-title fs-5" id="exampleModalLabel">
          Modal title
        </h1>
        <button
          type="button"
          className="btn-close"
          data-bs-dismiss="modal"
          aria-label="Close"
        />
      </div>
      <div className="modal-body">...</div>
      <div className="modal-footer">
        <button
          type="button"
          className="btn btn-secondary"
          data-bs-dismiss="modal"
        >
          Close
        </button>
        <button type="button" className="btn btn-primary">
          Save changes
        </button>
      </div>
    </div>
  </div>
</div>

    </>
  );
};
