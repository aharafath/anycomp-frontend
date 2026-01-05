import { activeTab } from "@/lib/features/tabs/tabsSlice";
import { RootState } from "@/lib/store";
import { Box, Tab, Tabs } from "@mui/material";

import { useDispatch, useSelector } from "react-redux";

interface Children {
  TAB_ITEMS: {
    id: number;
    label: string;
  }[];
}

const TabsComponent = ({ TAB_ITEMS }: Children) => {
  const currentTab = useSelector((state: RootState) => state.tabs.value);

  const dispatch = useDispatch();

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    dispatch(activeTab(newValue));
  };

  return (
    <Box sx={{ borderBottom: 2, borderColor: "#EEEEEE", mb: 4 }}>
      <Tabs
        className="-mb-0.5"
        value={currentTab}
        onChange={handleTabChange}
        variant="scrollable"
        scrollButtons={false}
        sx={{
          "& .MuiTabs-indicator": {
            backgroundColor: "#0A1D56",
            height: 2,
          },
          "& .MuiTab-root": {
            textTransform: "none",
            fontSize: "15px",
            fontWeight: 500,
            minWidth: "auto",
            padding: "12px 24px",
            color: "#222222",
            transition: "all 0.3s",
            "&:hover": { color: "#0A1D56", opacity: 0.8 },
          },
          "& .Mui-selected": {
            color: "#0A1D56 !important",
            fontWeight: 700,
          },
        }}
      >
        {TAB_ITEMS.map((item) => (
          <Tab key={item.id} label={item.label} />
        ))}
      </Tabs>
    </Box>
  );
};

export default TabsComponent;
