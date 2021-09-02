import React from 'react';
import * as yup from "yup";

import './App.css';
import FormBuilder from "./forms";
import { schema } from "./demo.json";

function App() {
	const initial = {
        orgName: "",
        website: "",
        addressLine1: "",
        addressLine2: "",
        city: "",
        provinceOrState: "",
        countryCode: "",
        postalCode: "",
        contactNumber: "",
        fax: "",
        defaultLanguage: "",
        defaultCurrency: "",
        email: "",
        activeStatus: 1,
    }
	const validations = yup.object({
		orgName: yup.string().required("Org name is required"),
		website: yup.string().url("Invalid URL"),
		addressLine1: yup.string().required("Org address is required"),
		city: yup.string().required("Org city is required"),
		provinceOrState: yup.string().required("Org province is required"),
		countryCode: yup.string().required("Org country is required"),
		postalCode: yup.string().required("Org postal code is required"),
		contactNumber: yup.string().required("Org contact is required"),
		defaultLanguage: yup.string().required("Default language is required"),
		defaultCurrency: yup.string().required("Default currency is required"),
		email: yup.string().email("Invalid Email").required("Org email is required"),
	});
	return (
		<div className="container py-4">
			<div className="card">
			  <div className="card-body">
			    <h5 className="card-title">Demo Form</h5>
				<FormBuilder
					btn="Submit"
					cancel={null}
					initial={initial}
					schema={schema}
					submit={(values: any) => alert(JSON.stringify(values, null, 2))}
					validations={validations}
				/>
			  </div>
			</div>
		</div>
	);
}

export default App;