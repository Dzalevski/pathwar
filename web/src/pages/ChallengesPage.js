import React, { useEffect, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Helmet } from "react-helmet";
import { Page, Grid } from "tabler-react";
import { isNil } from "ramda";
import { useIntl } from "react-intl";
import siteMetaData from "../constants/metadata";
import ChallengeList from "../components/challenges/ChallengeList";

import { fetchChallenges as fetchChallengesAction } from "../actions/seasons";
import usePrevious from "../hooks/usePrevious";

const ChallengesPage = () => {
  const intl = useIntl();
  const dispatch = useDispatch();

  const activeChallenges = useSelector(state => state.seasons.activeChallenges);
  const activeSeason = useSelector(state => state.seasons.activeSeason);
  const fetchChallenges = useCallback(
    seasonID => dispatch(fetchChallengesAction(seasonID)),
    [dispatch]
  );

  const prevProps = usePrevious({ activeSeason });
  const { title, description } = siteMetaData;

  useEffect(() => {
    const { activeSeason: prevActiveSeason } = prevProps || {};

    if (
      (isNil(prevActiveSeason) && activeSeason) ||
      (prevActiveSeason && prevActiveSeason.id === activeSeason.id)
    ) {
      if (isNil(activeChallenges)) {
        fetchChallenges(activeSeason.id);
      }
    }
  }, [activeChallenges, activeSeason, fetchChallenges, prevProps]);

  const challengesIntl = intl.formatMessage({ id: "nav.challenges" });

  return (
    <>
      <Helmet>
        <title>
          {title} - {challengesIntl}
        </title>
        <meta name="description" content={description} />
      </Helmet>
      <Page.Content title={challengesIntl}>
        <Grid.Row>
          <Grid.Col xs={12} sm={12} lg={12}>
            <ChallengeList challenges={activeChallenges} />
          </Grid.Col>
        </Grid.Row>
      </Page.Content>
    </>
  );
};

export default ChallengesPage;
