import "react-native-reanimated";
import { Text, View } from "react-native";
import useAuthStore from "@/stores/useAuthStore";
import { useEffect, useState } from "react";
import { useProposals } from "@/hooks/useProposalsHook";
import { Accordion } from "@/components/common/Accordion.component";
import BatteriesProposalContent from "@/components/proposals/BatteriesProposalContent.component";
import { ProposalI } from "@/types/Proposal";
import { ScrollView } from "react-native-gesture-handler";
import InvertersImprovementContent from "@/components/proposals/InverterProposalContent.component";
import FeesImprovementContent from "@/components/proposals/FeesProposalContent.component";
import PowersImprovementContent from "@/components/proposals/PowersImprovementContent.component";

export default function ProposalsPage() {
  const { user } = useAuthStore();
  const { proposalData, batteriesProposals, photovoltaicProposals, feesProposals, powersProposals, combinedProposals } = useProposals();

  useEffect(() => {
    console.log({ batteriesProposals });
  }, [batteriesProposals]);

  return (
    <ScrollView
      style={{
        backgroundColor: "#0F242A",
        flex: 1,
        width: "100%",
        flexDirection: "column",
      }}
    >
      {/*  <Accordion title="Batterias" disabled={batteriesProposals.length <= 0}> */}
      {batteriesProposals.map((proposal: ProposalI) => {
        return <BatteriesProposalContent key={proposal._id} props={{ proposal }} />;
      })}

      {photovoltaicProposals.map((proposal: ProposalI) => {
        return <InvertersImprovementContent key={proposal._id} props={{ proposal }} />;
      })}

      {feesProposals.map((proposal: ProposalI) => {
        return <FeesImprovementContent key={proposal._id} props={{ proposal }} />;
      })}

      {powersProposals.map((proposal: ProposalI) => {
        return <PowersImprovementContent key={proposal._id} props={{ proposal }} />;
      })}
      {/* </Accordion> */}
    </ScrollView>
  );
}
