import { PropsWithChildren } from 'react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { render, screen } from '@testing-library/react';

import { Stepper, StepperContext } from 'components';
import userEvent from '@testing-library/user-event';

const mockSteps = [
  {
    title: () => 'Step 1 label',
    render: ({
      dataContext,
      setStepPassed,
      activeStep,
      handleBack,
      handleNextStep,
    }: StepperContext<{}>): JSX.Element => (
      <div>
        <p>Step 1 description</p>
        <button
          data-testid="fail-btn"
          onClick={() => setStepPassed(activeStep.index, false)}
          disabled={!activeStep.passed}
        >
          Click to fail
        </button>
        <button
          data-testid="pass-btn"
          onClick={() => setStepPassed(activeStep.index, true)}
          disabled={activeStep.passed}
        >
          Click to pass
        </button>
        <button data-testid="back-btn" onClick={() => handleBack()}>
          Go back
        </button>
        <button
          data-testid="next-btn"
          onClick={() => handleNextStep()}
          disabled={!activeStep.passed}
        >
          Go to next step
        </button>
      </div>
    ),
  },
  {
    title: () => 'Step 2 label',
    render: ({
      dataContext,
      handlePreviousStep,
      handleNextStep,
    }: StepperContext<{}>): JSX.Element => (
      <div>
        <p>Step 2 description - no validation</p>
        <button data-testid="prev-btn" onClick={() => handlePreviousStep()}>
          Go to previous step
        </button>
        <button data-testid="next-btn" onClick={() => handleNextStep()}>
          Go to next step
        </button>
      </div>
    ),
    noValidate: true,
  },
  {
    title: () => 'Step 3 label',
    render: ({
      dataContext,
      setStepPassed,
      activeStep,
      handlePreviousStep,
      handleFinish,
    }: StepperContext<{}>): JSX.Element => (
      <div>
        <p>Step 3 description</p>
        <button
          data-testid="fail-btn"
          onClick={() => setStepPassed(activeStep.index, false)}
          disabled={!activeStep.passed}
        >
          Click to fail
        </button>
        <button
          data-testid="pass-btn"
          onClick={() => setStepPassed(activeStep.index, true)}
          disabled={activeStep.passed}
        >
          Click to pass
        </button>
        <button data-testid="prev-btn" onClick={() => handlePreviousStep()}>
          Go to previous step
        </button>
        <button
          data-testid="submit-btn"
          onClick={() => handleFinish()}
          disabled={!activeStep.passed}
        >
          Sumbit
        </button>
      </div>
    ),
  },
];

const MockRouter = ({ children }: PropsWithChildren): JSX.Element => (
  <MemoryRouter initialEntries={['/', '/stepper']}>
    <Routes>
      <Route path="/">
        <Route index element={<h1>Home page</h1>} />
        <Route path="stepper" element={children} />
      </Route>
    </Routes>
  </MemoryRouter>
);

const handleFinish = jest.fn();

afterEach(() => {
  jest.clearAllMocks();
});

const getStep1 = () => screen.getByTestId('step-1');
const getStep2 = () => screen.getByTestId('step-2');
const getStep3 = () => screen.getByTestId('step-3');
const getStep1Circle = () => screen.getByTestId('step-1-circle');
const getStep2Circle = () => screen.getByTestId('step-2-circle');
const getStep3Circle = () => screen.getByTestId('step-3-circle');
const getStep1Tick = () => screen.getByTestId('step-1-tick');
const getStep2Tick = () => screen.getByTestId('step-2-tick');
const getStep3Tick = () => screen.getByTestId('step-3-tick');
const getStep1Label = () => screen.getByText('Step 1 label');
const getStep2Label = () => screen.getByText('Step 2 label');
const getStep3Label = () => screen.getByText('Step 3 label');
const getStep1Description = () => screen.getByText('Step 1 description');
const getStep2Description = () =>
  screen.getByText('Step 2 description - no validation');
const getStep3Description = () => screen.getByText('Step 3 description');
const getBackBtn = () => screen.getByTestId('back-btn');
const getPrevBtn = () => screen.getByTestId('prev-btn');
const getNextBtn = () => screen.getByTestId('next-btn');
const getSubmitBtn = () => screen.getByTestId('submit-btn');
const getPassBtn = () => screen.getByTestId('pass-btn');
const getFailBtn = () => screen.getByTestId('fail-btn');

describe('Stepper', () => {
  it('should progress forward correctly', () => {
    render(
      <Stepper<{}>
        steps={mockSteps}
        dataContext={{}}
        onFinish={handleFinish}
      />,
      {
        wrapper: MockRouter,
      },
    );

    expect(getStep1Label()).toBeInTheDocument();
    expect(getStep1Description()).toBeInTheDocument();
    expect(getBackBtn()).toBeEnabled();
    expect(getFailBtn()).toBeDisabled();
    expect(getPassBtn()).toBeEnabled();
    expect(getNextBtn()).toBeDisabled();
    expect(getStep1Circle().textContent).toBe('1');
    expect(getStep2Circle().textContent).toBe('2');
    expect(getStep3Circle().textContent).toBe('3');
    expect(getStep1().classList).toContain('active');
    expect(getStep2().classList).toContain('disabled');
    expect(getStep3().classList).toContain('disabled');

    userEvent.click(getPassBtn());
    expect(getNextBtn()).toBeEnabled();
    expect(getStep2().classList).toContain('available');

    userEvent.click(getNextBtn());
    expect(getStep2Label()).toBeInTheDocument();
    expect(getStep2Description()).toBeInTheDocument();
    expect(getPrevBtn()).toBeEnabled();
    expect(getNextBtn()).toBeEnabled();
    expect(getStep1Tick()).toBeInTheDocument();
    expect(getStep2Circle().textContent).toBe('2');
    expect(getStep3Circle().textContent).toBe('3');
    expect(getStep1().classList).toContain('passed');
    expect(getStep2().classList).toContain('active');
    expect(getStep3().classList).toContain('available');

    userEvent.click(getNextBtn());
    expect(getStep3Label()).toBeInTheDocument();
    expect(getStep3Description()).toBeInTheDocument();
    expect(getPrevBtn()).toBeEnabled();
    expect(getFailBtn()).toBeDisabled();
    expect(getPassBtn()).toBeEnabled();
    expect(getSubmitBtn()).toBeDisabled();
    expect(getStep1Tick()).toBeInTheDocument();
    expect(getStep2Tick()).toBeInTheDocument();
    expect(getStep3Circle().textContent).toBe('3');
    expect(getStep1().classList).toContain('passed');
    expect(getStep2().classList).toContain('passed');
    expect(getStep3().classList).toContain('active');

    userEvent.click(getPassBtn());
    expect(getSubmitBtn()).toBeEnabled();

    userEvent.click(getSubmitBtn());
    expect(handleFinish).toBeCalledTimes(1);
  });

  it('should progress backwards correctly', () => {
    render(
      <Stepper<{}>
        steps={mockSteps}
        dataContext={{}}
        onFinish={handleFinish}
      />,
      {
        wrapper: MockRouter,
      },
    );

    userEvent.click(getPassBtn());
    userEvent.click(getNextBtn());
    userEvent.click(getNextBtn());
    userEvent.click(getPassBtn());

    userEvent.click(getPrevBtn());
    expect(getStep2Label()).toBeInTheDocument();
    expect(getStep2Description()).toBeInTheDocument();
    expect(getPrevBtn()).toBeEnabled();
    expect(getNextBtn()).toBeEnabled();
    expect(getStep1Tick()).toBeInTheDocument();
    expect(getStep2Circle().textContent).toBe('2');
    expect(getStep3Tick()).toBeInTheDocument();
    expect(getStep1().classList).toContain('passed');
    expect(getStep2().classList).toContain('active');
    expect(getStep3().classList).toContain('passed');

    userEvent.click(getPrevBtn());
    expect(getStep1Label()).toBeInTheDocument();
    expect(getStep1Description()).toBeInTheDocument();
    expect(getBackBtn()).toBeEnabled();
    expect(getFailBtn()).toBeEnabled();
    expect(getPassBtn()).toBeDisabled();
    expect(getNextBtn()).toBeEnabled();
    expect(getStep1Circle().textContent).toBe('1');
    expect(getStep2Tick()).toBeInTheDocument();
    expect(getStep3Tick()).toBeInTheDocument();
    expect(getStep1().classList).toContain('active');
    expect(getStep2().classList).toContain('passed');
    expect(getStep3().classList).toContain('passed');

    userEvent.click(getBackBtn());
    expect(screen.getByText('Home page')).toBeInTheDocument();
  });
});
