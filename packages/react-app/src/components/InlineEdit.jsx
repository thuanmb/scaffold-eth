import { useState } from "react";
import "./InlineEdit.css";

const DEFAULT_INPUT_SIZE = 20;

const InlineEdit = ({ component, value, setValue, className }) => {
  const [editingValue, setEditingValue] = useState(value);

  const onChange = event => setEditingValue(event.target.value);

  const onKeyDown = event => {
    if (event.key === "Enter" || event.key === "Escape") {
      event.target.blur();
    }
  };

  const onBlur = event => {
    if (event.target.value.trim() === "") {
      setEditingValue(value);
    } else {
      setValue(event.target.value);
    }
  };

  const ComponentClass = component;
  const finalClassName = className ? `inline-editor ${className}` : "inline-editor";

  return (
    <ComponentClass
      className={finalClassName}
      value={editingValue}
      onChange={onChange}
      onKeyDown={onKeyDown}
      onBlur={onBlur}
    />
  );
};

const TextInput = ({ ...props }) => {
  const inputSize = props.value ? props.value.length - 2 : DEFAULT_INPUT_SIZE;
  return (
    <div class="input-sizer" data-value={props.value}>
      <input type="text" size={inputSize} {...props} />
    </div>
  );
};

export const TextInlineEdit = ({ value, setValue, className }) => {
  return <InlineEdit component={TextInput} value={value} setValue={setValue} className={className} />;
};
