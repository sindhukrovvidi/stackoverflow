import "./index.css";

const Form = ({ children, title }) => {
  return (
    <div className="form">
      {title && <h2 className="form-title">{title}</h2>}
      {children}
    </div>
  );
};

export default Form;
