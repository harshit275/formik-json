import clsx from "clsx";
import { ErrorMessage, Field, FieldArray, Form, Formik } from "formik";
import AsyncSelect from "react-select/async";
import Select from "react-select";

export default function FormBuilder({ btn, cancel, initial, schema, submit, validations }: any) {
    function renderTypes(errors: any, item: any, setFieldValue: any, touched: any, values: any) {
        const { id, label, multi, options, placeholder, readonly, type, url } = item;
        switch (type) {
            case "array":
                return (
                    <>
                        <label htmlFor={id}>{label}</label>
                        <FieldArray name={id}>
                            {({ insert, remove, push }: any) => (
                                <div className="border rounded p-2">
                                    {(values[id].length > 0) && values[id].map((value: any, idx: number) =>
                                        <div key={idx} className="form-row align-items-center mb-2">
                                            {Object.keys(value).map((key: string, i: number) =>
                                                <div key={i} className="col-auto">
                                                    <label htmlFor={id}>{key}</label>
                                                    <input
                                                        className="form-control"
                                                        defaultValue={value[key]}
                                                        name={key}
                                                    />
                                                    <ErrorMessage
                                                        name={`${id}-${idx + 1}`}
                                                        component="div"
                                                        className="invalid-feedback"
                                                    />
                                                </div>
                                            )}
                                            <div className="col-auto pt-5">
                                                <button
                                                    type="button"
                                                    className="btn btn-secondary btn-small mt-2"
                                                    onClick={() => idx > 0 && remove(idx)}
                                                >
                                                    X
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                    <button
                                        type="button"
                                        className="btn btn-secondary btn-small"
                                        onClick={() => {
                                            let obj = { ...values[id][0] }
                                            Object.keys(obj).forEach(key => obj[key] = "");
                                            push(obj);
                                        }}
                                    >
                                        Add
                                    </button>
                                </div>
                            )}
                        </FieldArray>
                    </>
                );
            case "async":
                return (
                    <>
                        <label htmlFor={id}>{label}</label>
                        <AsyncSelect
                            cacheOptions
                            defaultOptions
                            getOptionLabel={(option) => option[id]}
                            getOptionValue={(option) => `${option['id']}`}
                            isMulti={multi}
                            loadOptions={async () => {
                                const response = await fetch(url);
                                const json = await response.json();
                                return json.Items;
                            }}
                            name={id}
                            onChange={(value: any) => setFieldValue(id, value)}
                            value={values[id]}
                        />
                        <ErrorMessage
                            name={id}
                            component="div"
                            className="invalid-feedback"
                        />
                    </>
                );
            case "auto":
                return (
                    <>
                        <label htmlFor={id}>{label}</label>
                        <Field
                            className={clsx("form-control", touched[id] &&
                                (errors[id] ? "is-invalid" : "is-valid"))
                            }
                            name={id}
                            onBlur={(event: any) => {
                                const value = event.target.value.trim().split(",");
                                setFieldValue(id, value);
                            }}
                            placeholder={placeholder}
                            readOnly={readonly}
                            type="text"
                        />
                        <small className="form-text text-muted">
                            Enter values separated by comma
                        </small>
                        <ErrorMessage
                            name={id}
                            component="div"
                            className="invalid-feedback"
                        />
                    </>
                );
            case "checkbox" || "radio" || "switch":
                return (
                    <div className="ml-5">
                        <Field className="form-check-input" name={id} type={type} />
                        <label className="form-check-label ml-2" htmlFor={id}>
                            {label}
                        </label>
                    </div>
                );
            case "select":
                return (
                    <>
                        <label htmlFor={id}>{label}</label>
                        <Select
                            isMulti={multi}
                            name={id}
                            options={options}
                            onChange={(value: any) => {
                                if (Array.isArray(value)) {
                                    let values = value.map(x => x.value);
                                    setFieldValue(id, values);
                                } else {
                                    setFieldValue(id, value.value);
                                }
                            }}
                            value={options.find((option: any) => option.value === values[id])}
                        />
                        <ErrorMessage
                            name={id}
                            component="div"
                            className="invalid-feedback"
                        />
                    </>
                );
            case "textarea":
                return (
                    <>
                        <label htmlFor={id}>{label}</label>
                        <Field
                            as={type}
                            className="form-control"
                            name={id}
                            placeholder={placeholder}
                        />
                        <ErrorMessage
                            name={id}
                            component="div"
                            className="invalid-feedback"
                        />
                    </>
                );
            default:
                return (
                    <>
                        <label htmlFor={id}>{label}</label>
                        <Field
                            className={clsx("form-control", touched[id] &&
                                (errors[id] ? "is-invalid" : "is-valid"))
                            }
                            name={id}
                            placeholder={placeholder}
                            readOnly={readonly}
                            type={type}
                        />
                        <ErrorMessage
                            name={id}
                            component="div"
                            className="invalid-feedback"
                        />
                    </>
                );
        }
    }

    return (
        <Formik
            enableReinitialize
            initialValues={initial}
            validationSchema={validations}
            onSubmit={async (values: any) => submit(values)}
        >
            {({ values, touched, setFieldValue, isSubmitting, errors }: any) =>
                <Form className="needs-validation">
                    {schema && schema.map((item: any, idx: number) =>
                        <div key={idx}>
                            <p className="text-muted mb-5">
                                {item[0].title}
                            </p>
                            <div key={idx} className="form-row">
                                {item.map((t: any, i: number) =>
                                    <div key={i} className="col-sm">
                                        <div className="form-group">
                                            {renderTypes(errors, t, setFieldValue, touched, values)}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                    <hr />
                    <button type="button" onClick={cancel} className="btn btn-danger">
                        Cancel
                    </button>
                    <button type="submit" className="btn btn-success float-right" disabled={isSubmitting}>
                        {btn}
                        {isSubmitting && <i className="fa fa-spinner fa-spin" />}
                    </button>
                </Form>
            }
        </Formik>
    );

    // version 1.0
    // return (
    //     <Form onSubmit={formik.handleSubmit}>
    //         {schema && schema.map((item: any, idx: number) =>
    //             <div key={idx}>
    //                 <Form.Label as="legend" className="mb-4">{item.input1.title}</Form.Label>
    //                 <Row>
    //                     <Form.Group as={Col} controlId={item.input1.id}>
    //                         {(item.input1.type === "checkbox" ||
    //                             item.input1.type === "radio" ||
    //                             item.input1.type === "switch") ?
    //                             <Form.Check
    //                                 type={item.input1.type}
    //                                 label={item.input1.label}
    //                             /> :
    //                             <>
    //                                 <Form.Label>{item.input1.label}</Form.Label>
    //                                 <Form.Control
    //                                     type={item.input1.type}
    //                                     placeholder={item.input1.placeholder}
    //                                     isInvalid={Boolean(formik.touched[item.input1.id] &&
    //                                         formik.errors[item.input1.id])}
    //                                     isValid={formik.touched[item.input1.id] &&
    //                                         !formik.errors[item.input1.id]}
    //                                     disabled={item.input1.disabled}
    //                                     as={item.input1.as}
    //                                     {...formik.getFieldProps(item.input1.id)}
    //                                 >
    //                                     {item.input1.options && item.input1.options.map((option: any, i: number) => (
    //                                         <option key={i} value={option.value}>
    //                                             {option.label}
    //                                         </option>
    //                                     ))}
    //                                 </Form.Control>
    //                             </>
    //                         }
    //                         <Form.Control.Feedback type="invalid">
    //                             {formik.errors[item.input1.id]}
    //                         </Form.Control.Feedback>
    //                     </Form.Group>
    //                     <Form.Group as={Col} controlId={item.input2.id}>
    //                         {(item.input2.type === "checkbox" || item.input2.type === "radio") ?
    //                             <Form.Check
    //                                 type={item.input2.type}
    //                                 label={item.input2.label}
    //                             /> :
    //                             <>
    //                                 <Form.Label>{item.input2.label}</Form.Label>
    //                                 <Form.Control
    //                                     type={item.input2.type}
    //                                     placeholder={item.input2.placeholder}
    //                                     isInvalid={Boolean(formik.touched[item.input2.id] &&
    //                                         formik.errors[item.input2.id])}
    //                                     isValid={formik.touched[item.input2.id] &&
    //                                         !formik.errors[item.input2.id]}
    //                                     disabled={item.input1.disabled}
    //                                     as={item.input2.as}
    //                                     {...formik.getFieldProps(item.input2.id)}
    //                                 >
    //                                     {item.input2.options && item.input2.options.map((option: any, i: number) => (
    //                                         <option key={i} value={option.value}>
    //                                             {option.label}
    //                                         </option>
    //                                     ))}
    //                                 </Form.Control>
    //                             </>
    //                         }
    //                         <Form.Control.Feedback type="invalid">
    //                             {formik.errors[item.input2.id]}
    //                         </Form.Control.Feedback>
    //                     </Form.Group>
    //                 </Row>
    //             </div>
    //         )}
    //         <hr />
    //         <Button variant="danger" type="button" onClick={cancel}>
    //             Cancel
    //         </Button>
    //         <Button variant="success" type="submit" className="float-right">
    //             {btn}
    //             {formik.isSubmitting && <i className="fa fa-spinner fa-spin" />}
    //         </Button>
    //     </Form>
    // );
}