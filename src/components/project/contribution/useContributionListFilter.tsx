import { MenuItem, Select, SelectChangeEvent, styled } from '@mui/material';
import React, { useMemo, useState } from 'react';
import {
	addYears,
	endOfMonth,
	endOfQuarter,
	endOfWeek,
	endOfYear,
	startOfQuarter,
	startOfWeek,
	startOfYear,
} from 'date-fns';

import { startOfMonth } from 'date-fns/fp';

import { StyledFlexBox } from '@/components/styledComponents';
import { EasAttestation, IContribution, IContributor, IProject, Status } from '@/services';
import { EasSchemaVoteKey } from '@/constant/eas';

export enum PeriodEnum {
	All = 'All',
	Week = 'Week',
	Month = 'Month',
	Season = 'Season',
	Year = 'Year',
}

export enum VoteStatusEnum {
	All = 'All',
	VoteByMe = 'VoteByMe',
	UnVotedByMe = 'UnVotedByMe',
	VoteEnded = 'VoteEnded',
}

export interface IProps {
	contributionList: IContribution[];
	contributorList: IContributor[];
	projectDetail?: IProject;
	easVoteMap: Record<string, EasAttestation<EasSchemaVoteKey>[]>;
	myVoteInfo: Record<string, number>;
}

const useContributionListFilter = ({
	contributionList,
	contributorList,
	projectDetail,
	easVoteMap,
	myVoteInfo,
}: IProps) => {
	const [filterPeriod, setFilterPeriod] = useState(PeriodEnum.All);
	const [filterVoteStatus, setFilterVoteStatus] = useState(VoteStatusEnum.All);
	const [filterContributor, setFilterContributor] = useState('All');

	const timestamp = useMemo(() => {
		if (filterPeriod === PeriodEnum.All) {
			return [addYears(new Date(), -5).getTime(), addYears(new Date(), 10).getTime()];
		} else if (filterPeriod === PeriodEnum.Year) {
			return [startOfYear(new Date()).getTime(), endOfYear(new Date()).getTime()];
		} else if (filterPeriod === PeriodEnum.Season) {
			return [startOfQuarter(new Date()).getTime(), endOfQuarter(new Date()).getTime()];
		} else if (filterPeriod === PeriodEnum.Month) {
			return [startOfMonth(new Date()).getTime(), endOfMonth(new Date()).getTime()];
		} else if (filterPeriod === PeriodEnum.Week) {
			return [startOfWeek(new Date()).getTime(), endOfWeek(new Date()).getTime()];
		} else {
			return [addYears(new Date(), -5).getTime(), addYears(new Date(), 10).getTime()];
		}
	}, [filterPeriod]);

	const filterByPeriod = (list: IContribution[]) => {
		if (!projectDetail) return list;
		const [filterStart, filterEnd] = timestamp;
		return list.filter(({ createAt }) => {
			const startTime = new Date(createAt).getTime();
			return startTime >= filterStart && startTime <= filterEnd;
		});
	};

	const filterByVoteStatus = (list: IContribution[]) => {
		if (filterVoteStatus === VoteStatusEnum.All) {
			return list;
		} else if (filterVoteStatus === VoteStatusEnum.VoteEnded) {
			if (!projectDetail) return list;
			return list.filter(({ createAt }) => {
				return (
					Date.now() >
					new Date(createAt).getTime() +
					Number(projectDetail.votePeriod) * 24 * 60 * 60 * 1000
				);
			});
		} else {
			const myVoteCids = Object.keys(myVoteInfo);
			if (filterVoteStatus === VoteStatusEnum.VoteByMe) {
				return list.filter(item => myVoteCids.includes(item.id.toString()));
			} else if (filterVoteStatus === VoteStatusEnum.UnVotedByMe) {
				return list.filter(item => !myVoteCids.includes(item.id.toString()));
			}
			return list;
		}
	};

	const filterContributionList = useMemo(() => {
		const list = contributionList.filter(contributor => contributor.status !== Status.UNREADY);
		const filterTimeList = filterByPeriod(list);
		const filterVoteList = filterByVoteStatus(filterTimeList);
		if (filterContributor === 'All') {
			return filterVoteList;
		}
		return filterVoteList.filter((contribution) =>
			contribution.toIds.includes(filterContributor),
		);
	}, [
		contributionList,
		contributorList,
		timestamp,
		filterVoteStatus,
		filterContributor,
		projectDetail,
		easVoteMap,
	]);

	const canClaimedContributionList = useMemo(() => {
		// TODO canClaim
		return filterContributionList.filter(item => item.status === Status.READY)
	}, [filterContributionList])

	const canClaim = (contribution: IContribution) => {
		if (contribution.status !== Status.READY) {
			return false
		} else {
			const targetTime = new Date(contribution.createAt).getTime() + Number(projectDetail?.votePeriod) * 24 * 60 * 60 * 1000
			const isEnd = Date.now() > targetTime;
			// TODO vote info
			return isEnd;
		}
	}

	const handlePeriodChange = (event: SelectChangeEvent) => {
		const value = event.target.value;
		setFilterPeriod(value as PeriodEnum);
	};
	const handleVoteStatusChange = (event: SelectChangeEvent) => {
		const value = event.target.value;
		console.log('handleVoteStatusChange', value);
		setFilterVoteStatus(value as VoteStatusEnum);
	};
	const handleContributorChange = (event: SelectChangeEvent) => {
		setFilterContributor(event.target.value);
	};

	const handleRest = () => {
		setFilterPeriod(PeriodEnum.All);
		setFilterVoteStatus(VoteStatusEnum.All);
		setFilterContributor('All');
	};
	const renderFilter = (
		<StyledFlexBox>
			<Select
				id="period-select"
				value={filterPeriod}
				onChange={handlePeriodChange}
				placeholder={'Period'}
				sx={{ width: '160px' }}
				size={'small'}
			>
				<MenuItem value={PeriodEnum.All}>All time</MenuItem>
				<MenuItem value={PeriodEnum.Week}>This week</MenuItem>
				<MenuItem value={PeriodEnum.Month}>This month</MenuItem>
				<MenuItem value={PeriodEnum.Season}>This season</MenuItem>
				<MenuItem value={PeriodEnum.Year}>This year</MenuItem>
			</Select>
			<Select
				id="vote-status"
				value={filterVoteStatus}
				onChange={handleVoteStatusChange}
				placeholder={'Vote Status'}
				sx={{ width: '200px', margin: '0 16px' }}
				size={'small'}
			>
				<MenuItem value={VoteStatusEnum.All}>All status</MenuItem>
				<MenuItem value={VoteStatusEnum.VoteByMe}>Voted by me</MenuItem>
				<MenuItem value={VoteStatusEnum.UnVotedByMe}>Unvoted by me</MenuItem>
				<MenuItem value={VoteStatusEnum.VoteEnded}>voted ended</MenuItem>
			</Select>
			<Select
				id="contributor"
				value={filterContributor}
				onChange={handleContributorChange}
				placeholder={'Contributor'}
				sx={{ width: '200px' }}
				size={'small'}
			>
				<MenuItem value={'All'}>All contributors</MenuItem>
				{contributorList.map((contributor) => (
					<MenuItem key={contributor.wallet} value={contributor.id}>
						{contributor.nickName}
					</MenuItem>
				))}
			</Select>
			<TextButton style={{ marginLeft: '16px' }} onClick={handleRest}>
				Reset
			</TextButton>
		</StyledFlexBox>
	);

	return { filterContributionList, renderFilter };
};

export default useContributionListFilter;

const TextButton = styled('span')({
	cursor: 'pointer',
	fontWeight: '500',
	'&:hover': {
		opacity: '0.5',
	},
});
