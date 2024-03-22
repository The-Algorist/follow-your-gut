import React, { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import FormElement from './FormElement';
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'react-dotenv';

dotenv.config();

const AssessmentForm = () => {
  const [apiResponse, setApiResponse] = useState('');

  const {
    control,
    handleSubmit,
    formState: { errors },
    //getValues,
  } = useForm({
    defaultValues: {
      age: 0,
      gender: '',
      height: 0,
      weight: 0,
      allergies: '',
      underlyingConditions: '',
      dietaryRestrictions: '',
      dietaryPreferences: '',
    },
  });

  const onSubmit = async (data) => {
    try {
      const genAI = new GoogleGenerativeAI(process.env.REACT_APP_API_KEY);
      const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
      const prompt = `Create a mealplan based on the following client information: ${JSON.stringify(data)}`;
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = await response.text();
      setApiResponse(text);
    } catch (error) {
      console.error('Error calling Gemini API:', error);
      setApiResponse(`Error: ${error.message}`);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Controller
          name="age"
          control={control}
          rules={{ required: true }}
          render={({ field }) => (
            <FormElement
              label="Age"
              type="number"
              placeholder="What is your age?"
              fieldRef={field}
              hasError={errors.age?.type === 'required'}
            />
          )}
        />

        <Controller
          name="gender"
          control={control}
          rules={{ required: true }}
          render={({ field }) => (
            <FormElement
              label="Gender"
              type="text"
              placeholder="What is your Gender?"
              fieldRef={field}
              hasError={errors.gender?.type === 'required'}
            />
          )}
        />

        <Controller
          name="height"
          control={control}
          rules={{ required: false }}
          render={({ field }) => (
            <FormElement
              label="Height"
              type="number"
              placeholder="What is your height?"
              fieldRef={field}
              hasError={errors.height?.type === 'required'}
            />
          )}
        />

        <Controller
          name="weight"
          control={control}
          rules={{ required: false }}
          render={({ field }) => (
            <FormElement
              label="Weight"
              type="number"
              placeholder="What is your weight?"
              fieldRef={field}
              hasError={errors.weight?.type === 'required'}
            />
          )}
        />

        <Controller
          name="allergies"
          control={control}
          rules={{ required: true }}
          render={({ field }) => (
            <FormElement
              label="Allergies"
              type="text"
              placeholder="Do you have any allergies?"
              fieldRef={field}
              hasError={errors.allergies?.type === 'required'}
            />
          )}
        />

        <Controller
          name="underlyingConditions"
          control={control}
          rules={{ required: true }}
          render={({ field }) => (
            <FormElement
              label="Underlying Medical Conditions"
              type="text"
              placeholder="Do you have any underlying medical conditions?"
              fieldRef={field}
              hasError={errors.underlyingConditions?.type === 'required'}
            />
          )}
        />

        <Controller
          name="dietaryRestrictions"
          control={control}
          rules={{ required: false }}
          render={({ field }) => (
            <FormElement
              label="Dietary Restrictions"
              type="text"
              placeholder="Do you have any dietary restrictions or food intolerances?"
              fieldRef={field}
              hasError={errors.dietaryRestrictions?.type === 'required'}
            />
          )}
        />

        <Controller
          name="dietaryPreferences"
          control={control}
          rules={{ required: false }}
          render={({ field }) => (
            <FormElement
              label="Dietary Preferences"
              type="text"
              placeholder="What food do you prefer?"
              fieldRef={field}
              hasError={errors.dietaryPreferences?.type === 'required'}
            />
          )}
        />
        <button
          type="submit"
          className="w-1/2 bg-green-dark text-white text-lg font-bold py-2 my-6 px-4 rounded-xl shadow-md md:px-8 capitalize"
        >
          Submit
        </button>
      </form>
      {apiResponse && (
        <div className="api-response">
          <h3>API Response</h3>
          <pre>{apiResponse}</pre>
        </div>
      )}
    </div>
  );
};

export default AssessmentForm;