import React, { useState, useEffect } from 'react';
import Header from '../../components/common/Header';
import Sidebar from '../../components/common/Sidebar';
import adminSurveyService from '../../services/admin/adminSurveyService'; // Using adminSurveyService for forms
import { FaEdit, FaTrash } from 'react-icons/fa';

const AdminFeedbackFormManagement = () => {
    const [forms, setForms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [newFormTitle, setNewFormTitle] = useState('');
    const [newFormDescription, setNewFormDescription] = useState('');
    const [questions, setQuestions] = useState([]);
    const [submittingForm, setSubmittingForm] = useState(false);
    const [submitError, setSubmitError] = useState(null);
    const [submitSuccess, setSubmitSuccess] = useState(false);

    useEffect(() => {
        fetchForms();
    }, []);

    const fetchForms = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await adminSurveyService.adminListSurveys();
            setForms(response.data || response);
        } catch (err) {
            console.error("Error fetching forms:", err);
            setError('Failed to load feedback forms.');
        } finally {
            setLoading(false);
        }
    };

    const handleAddQuestion = () => {
        setQuestions([...questions, { type: 'text', text: '', options: [] }]);
    };

    const handleQuestionChange = (index, field, value) => {
        const updatedQuestions = [...questions];
        updatedQuestions[index][field] = value;
        setQuestions(updatedQuestions);
    };

    const handleAddOption = (questionIndex) => {
        const updatedQuestions = [...questions];
        updatedQuestions[questionIndex].options.push('');
        setQuestions(updatedQuestions);
    };

    const handleOptionChange = (questionIndex, optionIndex, value) => {
        const updatedQuestions = [...questions];
        updatedQuestions[questionIndex].options[optionIndex] = value;
        setQuestions(updatedQuestions);
    };

    const handleRemoveQuestion = (index) => {
        setQuestions(questions.filter((_, i) => i !== index));
    };

    const handleCreateForm = async () => {
        if (!newFormTitle.trim() || questions.length === 0) {
            setSubmitError('Form title and at least one question are required.');
            return;
        }

        setSubmittingForm(true);
        setSubmitError(null);
        setSubmitSuccess(false);

        try {
            const formData = {
                title: newFormTitle,
                description: newFormDescription,
                questions: questions,
            };
            await adminSurveyService.createSurvey(formData); // Assuming createSurvey can be used for forms
            setSubmitSuccess(true);
            setNewFormTitle('');
            setNewFormDescription('');
            setQuestions([]);
            fetchForms(); // Refresh list
        } catch (err) {
            console.error("Error creating form:", err);
            setSubmitError(err.message || 'Failed to create form.');
        } finally {
            setSubmittingForm(false);
        }
    };

    const handleDeleteForm = async (id) => {
        if (!window.confirm('Are you sure you want to delete this form?')) return;
        try {
            await adminSurveyService.deleteSurvey(id);
            fetchForms(); // Refresh list
        } catch (err) {
            console.error("Error deleting form:", err);
            // Display error to user
        }
    };

    return (
        <div className="flex h-screen bg-gray-100">
            <Sidebar />
            <div className="flex-1 flex flex-col overflow-hidden">
                <Header pageTitle="Feedback Form Management" />
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-200 p-6">
                    <h1 className="text-3xl font-semibold text-gray-800 mb-2">Feedback Form Management</h1>
                    <p className="text-gray-600 mb-6">Manage feedback forms for courses and lecturers.</p>

                    {submitSuccess && (
                        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4" role="alert">
                            <strong className="font-bold">Success!</strong>
                            <span className="block sm:inline"> Form created successfully.</span>
                        </div>
                    )}
                    {submitError && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
                            <strong className="font-bold">Error!</strong>
                            <span className="block sm:inline"> {submitError}</span>
                        </div>
                    )}

                    {/* Create New Form Section */}
                    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">Create New Form</h2>
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="form-title">
                                Form Title
                            </label>
                            <input
                                type="text"
                                id="form-title"
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                value={newFormTitle}
                                onChange={(e) => setNewFormTitle(e.target.value)}
                                placeholder="Enter form title"
                            />
                        </div>
                        <div className="mb-6">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="form-description">
                                Form Description
                            </label>
                            <textarea
                                id="form-description"
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                rows="3"
                                value={newFormDescription}
                                onChange={(e) => setNewFormDescription(e.target.value)}
                                placeholder="Enter form description"
                            ></textarea>
                        </div>

                        <h3 className="text-lg font-semibold text-gray-800 mb-3">Add Questions</h3>
                        <div className="space-y-4 mb-6">
                            {questions.map((question, qIndex) => (
                                <div key={qIndex} className="bg-gray-50 p-4 rounded-md border border-gray-200">
                                    <div className="flex justify-end">
                                        <button className="text-red-600 hover:text-red-900 text-sm" onClick={() => handleRemoveQuestion(qIndex)}>Remove Question</button>
                                    </div>
                                    <div className="mb-3">
                                        <label className="block text-gray-700 text-sm font-bold mb-2">Question Type</label>
                                        <select
                                            className="form-select rounded-lg border border-gray-300 w-full py-2 px-3"
                                            value={question.type}
                                            onChange={(e) => handleQuestionChange(qIndex, 'type', e.target.value)}
                                        >
                                            <option value="text">Text Input</option>
                                            <option value="rating">Rating Scale</option>
                                            <option value="multiple-choice">Multiple Choice</option>
                                        </select>
                                    </div>
                                    <div className="mb-3">
                                        <label className="block text-gray-700 text-sm font-bold mb-2">Question Text</label>
                                        <input
                                            type="text"
                                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                            value={question.text}
                                            onChange={(e) => handleQuestionChange(qIndex, 'text', e.target.value)}
                                            placeholder="Enter question text"
                                        />
                                    </div>

                                    {question.type === 'rating' && (
                                        <div className="mb-3">
                                            <label className="block text-gray-700 text-sm font-bold mb-2">Rating Scale Range</label>
                                            <input
                                                type="number"
                                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                                value={question.ratingRange || 5} // Default to 5
                                                onChange={(e) => handleQuestionChange(qIndex, 'ratingRange', parseInt(e.target.value))}
                                                min="1"
                                                max="10"
                                            />
                                        </div>
                                    )}

                                    {question.type === 'multiple-choice' && (
                                        <div>
                                            <h4 className="text-md font-semibold text-gray-700 mb-2">Options</h4>
                                            {question.options.map((option, oIndex) => (
                                                <div key={oIndex} className="flex items-center mb-2">
                                                    <input
                                                        type="text"
                                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mr-2"
                                                        value={option}
                                                        onChange={(e) => handleOptionChange(qIndex, oIndex, e.target.value)}
                                                        placeholder={`Option ${oIndex + 1}`}
                                                    />
                                                </div>
                                            ))}
                                            <button
                                                className="mt-2 px-3 py-1 bg-blue-500 text-white text-sm font-semibold rounded-md hover:bg-blue-600"
                                                onClick={() => handleAddOption(qIndex)}
                                            >
                                                Add Option
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                        <button
                            className="px-4 py-2 bg-gray-600 text-white font-semibold rounded-md hover:bg-gray-700"
                            onClick={handleAddQuestion}
                        >
                            Add Question
                        </button>

                        <div className="mt-8 flex justify-end">
                            <button
                                className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                onClick={handleCreateForm}
                                disabled={submittingForm}
                            >
                                {submittingForm ? 'Creating...' : 'Create Form'}
                            </button>
                        </div>
                    </div>

                    {/* Existing Forms Section */}
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">Existing Forms</h2>
                    <div className="bg-white rounded-lg shadow-md overflow-hidden">
                        {loading ? (
                            <p>Loading forms...</p>
                        ) : error ? (
                            <p className="text-red-500">{error}</p>
                        ) : forms.length > 0 ? (
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {forms.map((form) => (
                                        <tr key={form.id}>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{form.title}</td>
                                            <td className="px-6 py-4 text-sm text-gray-500">{form.description}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${form.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                                                    {form.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <button className="text-indigo-600 hover:text-indigo-900 mr-3">View Responses</button>
                                                <button className="text-blue-600 hover:text-blue-900 mr-3"><FaEdit /></button>
                                                <button className="text-red-600 hover:text-red-900" onClick={() => handleDeleteForm(form.id)}><FaTrash /></button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <p className="text-gray-500">No feedback forms found.</p>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default AdminFeedbackFormManagement;
