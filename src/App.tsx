import {
  useState,
  useEffect,
  useImperativeHandle,
  forwardRef,
  useRef,
} from 'react';

interface Param {
  id: number;
  name: string;
  type: 'string';
}

interface ParamValue {
  paramId: number;
  value: string;
}

interface Model {
  paramValues: ParamValue[];
  colors: string[];
}

interface IParamsEditor {
  params: Param[];
  model: Model;
}

const ParamsEditor = forwardRef(({ params, model }: IParamsEditor, ref) => {
  const [values, setValues] = useState<Record<number, string>>({});

  useEffect(() => {
    const initialValues: Record<number, string> = {};

    model.paramValues.forEach((pv) => {
      initialValues[pv.paramId] = pv.value;
    });

    setValues(initialValues);
  }, [model]);

  const handleChange = (paramId: number, newValue: string) => {
    setValues((prev) => ({
      ...prev,
      [paramId]: newValue,
    }));
  };

  useImperativeHandle(ref, () => ({
    getModel: (): Model => {
      const paramValues = params.map((param) => ({
        paramId: param.id,
        value: values[param.id] || '',
      }));
      return {
        paramValues,
        colors: model.colors || [],
      };
    },
  }));

  return (
    <div>
      {params.map((param) => (
        <div key={param.id} style={{ marginBottom: 10 }}>
          <label style={{ marginRight: 10 }}>{param.name}:</label>
          <input
            type="text"
            value={values[param.id] || ''}
            onChange={(e) => handleChange(param.id, e.target.value)}
          />
        </div>
      ))}
    </div>
  );
});

const App = () => {
  const editorRef = useRef<any>(null);

  const params: Param[] = [
    { id: 1, name: 'Назначение', type: 'string' },
    { id: 2, name: 'Длина', type: 'string' },
  ];

  const model: Model = {
    paramValues: [
      { paramId: 1, value: 'повседневное' },
      { paramId: 2, value: 'макси' },
    ],
    colors: [],
  };

  const handleClick = () => {
    if (editorRef.current) {
      const result = editorRef.current.getModel();
      console.log('результат getModel():', result);
    }
  };

  return (
    <>
      <h2>Редактор параметров</h2>
      <ParamsEditor ref={editorRef} params={params} model={model} />
      <button onClick={handleClick} style={{ marginTop: 20 }}>
        Получить модель
      </button>
    </>
  );
};

export default App;
