'use client';

import {
	Box,
	Button,
	Container,
	List,
	ListItem,
	ListItemIcon,
	ListItemText,
	Paper,
	Step,
	StepLabel,
	Stepper,
	Typography,
} from '@mui/material';
import CircleIcon from '@mui/icons-material/Circle';
import { createContext, ReactNode, useContext, useRef, useState } from 'react';

import { Img3Provider } from '@lxdao/img3';

import StepStart from '@/components/createProject/step/start';
import StepStrategy, { StepStrategyRef } from '@/components/createProject/step/strategy';
import StepProfile, { StepProfileRef } from '@/components/createProject/step/profile';
import StepContributor, { StepContributorRef } from '@/components/createProject/step/contributor';
import { defaultGateways } from '@/constant/img3';

const steps = [
	{
		label: 'Getting started',
	},
	{
		label: 'Profile',
	},
	{
		label: 'Strategy',
	},
	{
		label: 'Contributors',
	},
];

export default function Page() {
	const [activeStep, setActiveStep] = useState(0);

	const stepProfileRef = useRef<StepProfileRef | null>(null);
	const stepStrategyRef = useRef<StepStrategyRef | null>(null);
	const stepContributorRef = useRef<StepContributorRef | null>(null);
	const handleGetFormData = () => {
		const profileFormData = stepProfileRef.current?.getFormData();
		const strategyFormData = stepStrategyRef.current?.getFormData();
		const contributorFormData = stepContributorRef.current?.getFormData();
		console.log('profileFormData Form Data:', profileFormData);
		console.log('strategyFormData Form Data:', strategyFormData);
		console.log('contributorFormData Form Data:', contributorFormData);
	};

	return (
		<Img3Provider defaultGateways={defaultGateways}>
			<Container
				maxWidth={'xl'}
				sx={{
					display: 'flex',
					justifyContent: 'center',
					alignItems: 'flex-start',
					paddingTop: '56px',
				}}
			>
				<Box sx={{ maxWidth: 200 }}>
					<Stepper activeStep={activeStep} orientation="vertical">
						{steps.map((step, index) => (
							<Step sx={{ cursor: 'pointer' }} key={step.label}>
								<StepLabel onClick={() => setActiveStep(index)}>
									{step.label}
								</StepLabel>
							</Step>
						))}
					</Stepper>
				</Box>
				<Box sx={{ flex: 1, maxWidth: '860px', minWidth: '400px', marginLeft: '40px' }}>
					<Typography variant={'h2'} style={{ fontWeight: 'bold', marginBottom: '32px' }}>
						Create a project
					</Typography>

					<StepContent step={0} activeStep={activeStep}>
						<StepStart step={0} setActiveStep={setActiveStep} />
					</StepContent>
					<StepContent step={1} activeStep={activeStep}>
						<StepProfile ref={stepProfileRef} step={1} setActiveStep={setActiveStep} />
					</StepContent>
					<StepContent step={2} activeStep={activeStep}>
						<StepStrategy
							ref={stepStrategyRef}
							step={2}
							setActiveStep={setActiveStep}
						/>
					</StepContent>
					<StepContent step={3} activeStep={activeStep}>
						<StepContributor
							ref={stepContributorRef}
							step={3}
							setActiveStep={setActiveStep}
						/>
					</StepContent>
					<Button
						variant={'contained'}
						onClick={handleGetFormData}
						sx={{ marginTop: '40px' }}
					>
						console form data
					</Button>
				</Box>
			</Container>
		</Img3Provider>
	);
}

function StepContent({
	step,
	children,
	activeStep,
}: {
	step: number;
	activeStep: number;
	children: ReactNode;
}) {
	return <div style={{ display: activeStep === step ? 'block' : 'none' }}>{children}</div>;
}
