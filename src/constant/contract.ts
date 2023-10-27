// @ts-ignore
import project_register_abi = require('../../abi/project_register_abi.json');
// @ts-ignore
import project_abi = require('../../abi/project_abi.json');

export const ProjectRegisterABI = project_register_abi;
export const ProjectABI = project_abi;

export const ContractAddressMap = {
	/**
	 * use ProjectRegisterUpgradeableProxy
	 */
	// ProjectRegistry: '0xA164E14558B4665ee512cF15dD12d1a7A8492830',
	ProjectRegistry: process.env.NEXT_PUBLIC_CONTRACT_PROJECT_REGISTER as string,
	/**
	 * DefaultRelativeVotingStrategy
	 */
	// VotingStrategy: '0x13A5DfeB3E823378e379Bb59A46c5c9E19a3Fc37',
	VotingStrategy: process.env.NEXT_PUBLIC_CONTRACT_VOTING_STRATEGY as string,
};
