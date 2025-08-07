import { Accordion, AccordionDetails, AccordionSummary } from "@mui/material";
import { Checkbox } from "../shared/Input";
import { Label } from "../shared/Label";

export const AccessRestrictions = ({ value, onValueChange, disabled, role }) => {
  const options = [
    {
      page: "orders",
      label: "Orders",
      statuses: [
        "draft",
        "pending",
        "awaiting transfer",
        "awaiting pickup",
        "in progress",
        "problem",
        "fulfilled",
        "cancelled",
      ],
    },
    {
      page: "pickups",
      label: "Pickups",
      statuses: ["pending", "in progress", "problem", "fulfilled", "cancelled"],
    },
    {
      page: "transfers",
      label: "Transfers",
      statuses: ["pending", "in progress", "problem", "fulfilled", "cancelled"],
    },
    {
      page: "purges",
      label: "Purges",
      statuses: [],
    },
    {
      page: "products",
      label: "Products",
      statuses: [],
    },
    {
      page: "invoices",
      label: "Invoices",
      statuses: [],
    },
    {
      page: "deliverers",
      label: "Deliverers",
      statuses: [],
    },
    {
      page: "cycles",
      label: "Cycles",
      statuses: [],
    },
    {
      page: "account",
      label: "Account",
      statuses: [],
    },
    {
      page: "payments",
      label: "Payments",
      role: "payman",
      statuses: [],
    },
    {
      page: "tenant-cycles",
      label: "Tenant Payments",
      role: "payman",
      statuses: [],
    },
    {
      page: "warehouse-cycles",
      label: "Warehouse Payments",
      role: "payman",
      statuses: [],
    },
    {
      page: "client-cycles",
      label: "Client Payments",
      role: "payman",
      statuses: [],
    },
    {
      page: "containers",
      label: "Containers",
      statuses: [],
      // statuses: ["pending", "sent", "arrived", "resolved", "discarded"],
    },
    {
      page: "deactivate-deliverer",
      label: "Can deactivate deliverer",
      role: "warehouse",
      statuses: [],
    },
    {
      page: "download-containers-orders",
      label: "Can download containers orders",
      role: "warehouse",
      statuses: [],
    },
    {
      page: "print-containers-orders",
      label: "Can print containers orders",
      role: "warehouse",
      statuses: [],
    },
  ];

  const filteredOptions = options.filter(opt => {
    if (role === "payman") {
      return opt.role === "payman";
    }
    if (role === "warehouse") {
      return !opt.role || opt.role === "warehouse";
    }
    return !opt.role || opt.role !== "payman";
  });

  return (
    <Accordion>
      <AccordionSummary
        aria-controls="panel1-content"
        id="panel1-header"
        expandIcon={<i className="fas fa-chevron-down"></i>}>
        Access Restrictions
      </AccordionSummary>
      <AccordionDetails className="flex flex-col gap-y-[20px]">
        <div className="flex items-center gap-x-[5px] text-sm pointer-events-none text-gray-700">
          <Checkbox value={true} className="opacity-50" /> = can access
        </div>

        {filteredOptions.map((opt) => (
          <div key={opt.page}>
            <div className="flex gap-x-[5px]">
              <Checkbox
                disabled={disabled}
                value={!value?.pages?.includes(opt.page)}
                onValueChange={(checked) =>
                  onValueChange({
                    ...value,
                    pages: !checked
                      ? [...value.pages, opt.page]
                      : value.pages.filter((p) => p !== opt.page),
                  })
                }
              />
              <Label text={opt.label} />
            </div>
            <div className="ml-[30px]">
              {opt.statuses.map((status) => (
                <div className="flex gap-x-[5px]" key={status}>
                  <Checkbox
                    disabled={disabled || value?.pages?.includes(opt.page)}
                    value={
                      value?.pages?.includes(opt.page)
                        ? false
                        : !value?.statuses?.[opt.page]?.includes(status)
                    }
                    onValueChange={(checked) =>
                      onValueChange({
                        ...value,
                        statuses: {
                          ...value.statuses,
                          [opt.page]: !checked
                            ? [...(value.statuses[opt.page] || []), status]
                            : value.statuses[opt.page]?.filter((val) => val !== status),
                        },
                        // statuses: {
                        //   ...value?.statuses,
                        //   [opt.page]: !checked
                        //     ? [...value?.statuses?.[opt.page], status]
                        //     : value?.statuses?.[opt.page]?.filter((s) => s !== status),
                        // },
                      })
                    }
                  />
                  <Label text={status} />
                </div>
              ))}
            </div>
          </div>
        ))}
      </AccordionDetails>
    </Accordion>
  );
};
