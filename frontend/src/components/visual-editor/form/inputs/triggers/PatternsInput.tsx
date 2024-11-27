/*
 * Copyright © 2024 Hexastack. All rights reserved.
 *
 * Licensed under the GNU Affero General Public License v3.0 (AGPLv3) with the following additional terms:
 * 1. The name "Hexabot" is a trademark of Hexastack. You may not use this name in derivative works without express written permission.
 * 2. All derivative works must include clear attribution to the original creator and software, Hexastack and Hexabot, in a prominent location (e.g., in the software's "About" section, documentation, and README file).
 */

import {
  Abc,
  Add,
  Mouse,
  PsychologyAlt,
  RemoveCircleOutline,
  Spellcheck,
} from "@mui/icons-material";
import { Box, IconButton, styled } from "@mui/material";
import { FC, useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";

import DropdownButton, {
  DropdownButtonAction,
} from "@/app-components/buttons/DropdownButton";
import { useTranslate } from "@/hooks/useTranslate";
import { Pattern } from "@/types/block.types";
import { SXStyleOptions } from "@/utils/SXStyleOptions";
import { createValueWithId, ValueWithId } from "@/utils/valueWithId";

import { getInputControls } from "../../utils/inputControls";

import PatternInput from "./PatternInput";

const StyledNoPatternsDiv = styled("div")(
  SXStyleOptions({
    color: "grey.500",
    textAlign: "center",
    marginY: 2,
    marginX: 0,
    width: "100%",
  }),
);
const actions: DropdownButtonAction[] = [
  { icon: <Spellcheck />, name: "Exact Match", defaultValue: "" },
  { icon: <Abc />, name: "Pattern Match", defaultValue: "//" },
  { icon: <PsychologyAlt />, name: "Intent Match", defaultValue: [] },
  { icon: <Mouse />, name: "Interaction", defaultValue: {} },
];

type PatternsInputProps = {
  value: Pattern[];
  onChange: (patterns: Pattern[]) => void;
  minInput: number;
};

const PatternsInput: FC<PatternsInputProps> = ({ value, onChange }) => {
  const { t } = useTranslate();
  const [patterns, setPatterns] = useState<ValueWithId<Pattern>[]>(
    value.map((pattern) => createValueWithId(pattern)),
  );
  const {
    register,
    formState: { errors },
  } = useFormContext<any>();
  const addInput = (defaultValue: Pattern) => {
    setPatterns([...patterns, createValueWithId<Pattern>(defaultValue)]);
  };
  const removeInput = (index: number) => {
    const updatedPatterns = [...patterns];

    updatedPatterns.splice(index, 1);

    setPatterns(updatedPatterns);
  };
  const updateInput = (index: number) => (p: Pattern) => {
    patterns[index].value = p;
    setPatterns([...patterns]);
  };

  useEffect(() => {
    onChange(patterns.map(({ value }) => value));
  }, [patterns]);

  return (
    <Box display="flex" flexDirection="column">
      <Box display="flex" flexDirection="column">
        {patterns.length == 0 ? (
          <StyledNoPatternsDiv>{t("label.no_patterns")}</StyledNoPatternsDiv>
        ) : (
          patterns.map(({ value, id }, idx) => (
            <Box display="flex" mt={2} key={id}>
              <PatternInput
                idx={idx}
                value={value}
                onChange={updateInput(idx)}
                getInputProps={getInputControls(
                  "label",
                  errors,
                  register,
                  t("message.text_is_required"),
                )}
              />
              <IconButton size="small" color="error" onClick={() => removeInput(idx)}>
                <RemoveCircleOutline />
              </IconButton>
            </Box>
          ))
        )}
      </Box>
      <DropdownButton
        sx={{ alignSelf: "end", marginTop: 2 }}
        label={t("button.add_pattern")}
        actions={actions}
        onClick={(action) => addInput(action.defaultValue as Pattern)}
        icon={<Add />}
      />
    </Box>
  );
};

PatternsInput.displayName = "PatternsInput";

export default PatternsInput;
