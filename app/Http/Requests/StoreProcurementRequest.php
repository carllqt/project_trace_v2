<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreProcurementRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     */
    public function rules(): array
    {
        return [
            'pr_no' => [
                'required',
                'string',
                'max:255',
                'unique:procurements,pr_no',
            ],

            'project_title' => [
                'required',
                'string',
                'max:255',
            ],

            'purpose' => [
                'nullable',
                'string',
            ],

            'end_user' => [
                'nullable',
                'string',
                'max:255',
            ],

            'abc' => [
                'nullable',
                'numeric',
                'min:0',
                'max:9999999999999.99',
            ],

            'mode_of_procurement' => [
                'nullable',
                'string',
                'max:255',
            ],

            'status' => [
                'nullable',
                'in:Preparation of PR,Preparation of RFQ,Preparation of PO,Delivery,Implementation,Payment,Completed',
            ],

            'current_department_id' => [
                'nullable',
                'integer',
                'exists:departments,id',
            ],

            'documents' => [
                'nullable',
                'array',
            ],

            'documents.*' => [
                'file',
                'max:10240',
            ],
        ];
    }

    /**
     * Get custom validation messages.
     */
    public function messages(): array
    {
        return [
            'pr_no.required' => 'The PR number is required.',
            'pr_no.string' => 'The PR number must be valid.',
            'pr_no.max' => 'The PR number may not exceed 255 characters.',
            'pr_no.unique' => 'This PR number already exists.',

            'project_title.required' => 'The project title is required.',
            'project_title.string' => 'The project title must be valid.',
            'project_title.max' => 'The project title may not exceed 255 characters.',

            'purpose.string' => 'The purpose must be valid.',

            'end_user.string' => 'The selected end user must be valid.',
            'end_user.max' => 'The end user may not exceed 255 characters.',

            'abc.numeric' => 'The ABC must be a valid amount.',
            'abc.min' => 'The ABC cannot be negative.',
            'abc.max' => 'The ABC amount is too large.',

            'mode_of_procurement.string' => 'The mode of procurement must be valid.',
            'mode_of_procurement.max' => 'The mode of procurement may not exceed 255 characters.',

            'status.in' => 'The selected procurement status is invalid.',

            'current_department_id.integer' => 'The selected department is invalid.',
            'current_department_id.exists' => 'The selected department does not exist.',

            'documents.array' => 'The uploaded documents must be a valid list.',

            'documents.*.file' => 'Each uploaded document must be a valid file.',
            'documents.*.max' => 'Each document must not exceed 10 MB.',
        ];
    }
}

