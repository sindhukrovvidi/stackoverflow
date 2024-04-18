import "./index.css";

const OrderButton = ({ message, setQuestionOrder, isActive }) => {
    return (
        <button
        className={`btn ${isActive ? 'active' : ''}`}
            onClick={() => {
                setQuestionOrder(message);
            }}
        >
            {message}
        </button>
    );
};

export default OrderButton;
