import { useEffect, useState, useCallback, useContext, useRef } from "react";
import s from "./style.module.scss";
import { Box } from "../../incidentReport";
import { InvestigationContext } from "../InvestigationContext";
import {
  Select,
  Table,
  TableActions,
  Combobox,
  Input,
  Textarea,
  FileInput,
  Radio,
  Tabs,
  Moment,
  moment,
  CustomRadio,
  FishboneDiagram,
} from "../../elements";
import { ImEye } from "react-icons/im";
import {
  FaRegTrashAlt,
  FaCheck,
  FaPlus,
  FaPlusCircle,
  FaPencilAlt,
  FaFlag,
  FaMinusCircle,
  FaEllipsisV,
  FaUndo,
  FaExternalLinkAlt,
  FaTimes,
} from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import { BsPencilFill } from "react-icons/bs";
import { useFetch } from "../../../hooks";
import {
  endpoints as defaultEndpoints,
  permissions,
  riskColors,
} from "../../../config";
import { Prompt, Modal } from "../../modal";
import { useForm, FormProvider, useFormContext } from "react-hook-form";

export const ConnectForm = ({ children }) => {
  const methods = useFormContext();
  return children({ ...methods });
};

const Rca = () => {
  const { ir, setIr } = useContext(InvestigationContext);
  const [parameters, setParameters] = useState({
    severity: [],
    likelihood: [],
    users: [],
    departments: [],
    roles: permissions.map((p) => ({ value: p.id, label: p.label })),
    risks: [],
    riskStatus: [],
  });
  const [requestInput, setRequestInput] = useState(false);
  const [similarIncidents, setSimilarIncidents] = useState([
    {
      id: "23",
      sequence: "IR1/2/24",
      location: 1,
      incident_date_time: "2022-01-07T20:23",
    },
    {
      id: "24",
      sequence: "IR1/2/24",
      location: 1,
      incident_date_time: "2022-01-07T20:23",
    },
    {
      id: "25",
      sequence: "IR1/2/24",
      location: 1,
      incident_date_time: "2022-01-07T20:23",
    },
    {
      id: "26",
      sequence: "IR1/2/24",
      location: 1,
      incident_date_time: "2022-01-07T20:23",
    },
    {
      id: "27",
      sequence: "IR1/2/24",
      location: 1,
      incident_date_time: "2022-01-07T20:23",
    },
    {
      id: "28",
      sequence: "IR1/2/24",
      location: 1,
      incident_date_time: "2022-01-07T20:23",
    },
    {
      id: "29",
      sequence: "IR1/2/24",
      location: 1,
      incident_date_time: "2022-01-07T20:23",
    },
    {
      id: "30",
      sequence: "IR1/2/24",
      location: 1,
      incident_date_time: "2022-01-07T20:23",
    },
    {
      id: "31",
      sequence: "IR1/2/24",
      location: 1,
      incident_date_time: "2022-01-07T20:23",
    },
    {
      id: "32",
      sequence: "IR1/2/24",
      location: 1,
      incident_date_time: "2022-01-07T20:23",
    },
  ]);
  const [showSimilarIncidents, setShowSimilarIncidents] = useState(false);
  const methods = useForm();

  const [rcaRootcause, setRcaRootcause] = useState(ir.rcaRootcause || []);
  const [rcaIdentified, setRcaIdentified] = useState(ir.rcaIdentified || []);
  const [rcaTeam, setRcaTeam] = useState(ir.rcaTeam || []);

  const {
    post: saveRootCause,
    put: updateRootCause,
    remove: deleteRootCause,
    loading: updatingRooCause,
  } = useFetch(defaultEndpoints.rcaRootCauses + `/{ID}`, {
    validator: { why: /^[\-\+.,:|@ a-z0-9]+$/gi },
  });
  const {
    post: saveRcaIdentified,
    put: updateRcaIdentified,
    remove: deleteRcaIdentified,
    loading: updatingRcaIdentified,
  } = useFetch(defaultEndpoints.rcaIdentified + `/{ID}`);
  const {
    post: saveRcaTeam,
    put: updateRcaTeam,
    remove: deleteRcaTeam,
    loading: updatingRcaTeam,
  } = useFetch(defaultEndpoints.rcaTeam + `/{ID}`);

  const submitMainForm = useCallback(
    (values) => {
      Promise.all([
        ...rcaRootcause
          .filter((item) => ["delete", "edit", "add"].includes(item.action))
          .map((item) => {
            if (item.action === "delete") {
              return deleteRootCause(null, { params: { "{ID}": item.id } });
            }
            if (item.action === "add") {
              return saveRootCause(
                {
                  ...item,
                  probStmt: values.problemStatement,
                  rcaDate: values.rcaDate,
                  incidentReport: { id: ir.id },
                  id: undefined,
                },
                { params: { "{ID}": "" } }
              );
            }
            if (item.action === "edit") {
              return updateRootCause(
                {
                  ...item,
                  probStmt: values.problemStatement,
                  rcaDate: values.rcaDate,
                  incidentReport: { id: ir.id },
                  id: undefined,
                },
                { params: { "{ID}": item.id } }
              );
            }
          }),
        ...rcaIdentified
          .filter((item) => ["delete", "edit", "add"].includes(item.action))
          .map((item) => {
            if (item.action === "delete") {
              return deleteRcaIdentified(null, { params: { "{ID}": item.id } });
            }
            if (item.action === "add") {
              return saveRcaIdentified(
                { ...item, incidentReport: { id: ir.id }, id: undefined },
                { params: { "{ID}": "" } }
              );
            }
            if (item.action === "edit") {
              return updateRcaIdentified(
                { ...item, incidentReport: { id: ir.id }, id: undefined },
                { params: { "{ID}": item.id } }
              );
            }
          }),
        ...rcaTeam
          .filter((item) => ["delete", "edit", "add"].includes(item.action))
          .map((item) => {
            if (item.action === "delete") {
              return deleteRcaTeam(null, { params: { "{ID}": item.id } });
            }
            if (item.action === "add") {
              return saveRcaTeam(
                { ...item, incidentReport: { id: ir.id }, id: undefined },
                { params: { "{ID}": "" } }
              );
            }
            if (item.action === "edit") {
              return updateRcaTeam(
                { ...item, incidentReport: { id: ir.id }, id: undefined },
                { params: { "{ID}": item.id } }
              );
            }
          }),
      ])
        .then((resps) => {
          const _rcaRootcause = resps
            .filter((item) => item?.data?.why)
            .map((item) => item.data);
          const _rcaIdentified = resps
            .filter((item) => item?.data?.rcaCat && item.data.details)
            .map((item) => item.data);
          const _rcaTeam = resps
            .filter((item) => item?.data?.designation)
            .map((item) => item.data);
          setIr((prev) => ({
            ...prev,
            rcaRootcause: [
              ..._rcaRootcause,
              ...rcaRootcause.filter((item) => !item.action),
            ],
            rcaIdentified: [
              ..._rcaIdentified,
              ...rcaIdentified.filter((item) => !item.action),
            ],
            rcaTeam: [..._rcaTeam, ...rcaTeam.filter((item) => !item.action)],
          }));
          Prompt({
            type: "success",
            message: "Updates have been saved.",
          });
        })
        .catch((err) =>
          Prompt({
            type: "error",
            message: err.message,
          })
        );
    },
    [ir, rcaRootcause, rcaIdentified, rcaTeam]
  );

  const { get: getUsers } = useFetch(defaultEndpoints.users + `?size=10000`);
  const { get: getDepartments } = useFetch(
    defaultEndpoints.departments + `?size=10000`
  );

  useEffect(() => {
    Promise.all([getUsers(), getDepartments()]).then(
      ([{ data: users }, { data: departments }]) => {
        const _parameters = {};

        if (users?._embedded.user) {
          _parameters.users = users._embedded.user.map((user) => {
            user.role = Array.isArray(user.role)
                ? user.role
                : user.role?.split(",") || [];
            return ({
              label: user.name,
              value: user.id,
              department: user.department,
              designation: user.designation,
              role: user.role
                .map((role) => +role)
                .filter((item) => item),
            })
          });
        }

        if (departments?._embedded?.department) {
          _parameters.departments = departments._embedded.department.map(
            (dept) => ({ label: dept.name, value: dept.id })
          );
        }

        setParameters((prev) => ({ ...prev, ..._parameters }));
      }
    );
  }, []);

  useEffect(() => {
    setRcaRootcause(ir.rcaRootcause || []);
    if (ir.rcaRootcause?.length) {
      methods.setValue("problemStatement", ir.rcaRootcause[0].probStmt);
    }
  }, [ir.rcaRootcause]);
  useEffect(() => {
    setRcaIdentified(ir.rcaIdentified || []);
  }, [ir.rcaIdentified]);
  useEffect(() => {
    setRcaTeam(ir.rcaTeam || []);
  }, [ir.rcaTeam]);

  return (
    <FormProvider {...methods}>
      <div className={s.rca}>
        <section className={s.rcaDate}>
          <label>Date of conducting Root Cause Analysis:</label>
          <Input
            type="date"
            {...methods.register("rcaDate")}
            value={moment({
              time: new Date(
                (ir.rcaRootcause?.length && ir.rcaRootcause[0].rcaDate) ||
                  new Date()
              ),
              format: "YYYY-MM-DD",
            })}
            errors={methods.formState.errors.rcaDate}
          />
        </section>
        <Box collapsable label="POTENTIAL PROBLEM AREAS">
          <ProblemAreas
            events={[
              {
                id: 12,
                no: 1,
                details:
                  "The department allowed the compnay staff to work without any official information just because the ousourced people were accoumplained by the security.",
              },
              {
                id: 14,
                no: 2,
                details: "The lab is not connected to the power backup.",
              },
            ]}
          />
        </Box>
        <Box collapsable label="ROOT CAUSE">
          <RootCause
            rcaRootcause={rcaRootcause}
            setRcaRootcause={setRcaRootcause}
            rcaIdentified={rcaIdentified}
            setRcaIdentified={setRcaIdentified}
          />
        </Box>
        <Box label="RCA TEAM MEMBERS" collapsable>
          <RcaTeamMembers
            rcaTeam={rcaTeam}
            setRcaTeam={setRcaTeam}
            parameters={parameters}
          />
        </Box>
        <Modal
          head
          label="RECORD INPUTS"
          open={showSimilarIncidents}
          setOpen={setShowSimilarIncidents}
          className={s.similarIncidentsModal}
        >
          <SimilarIncidents similarIncidents={similarIncidents} />
        </Modal>
        <form
          className={s.btns}
          onSubmit={methods.handleSubmit(submitMainForm)}
        >
          <button
            className="btn secondary ghost wd-100"
            type="button"
            onClick={() => {}}
          >
            Close
          </button>
          <button onClick={() => {}} className="btn secondary wd-100">
            Edit
          </button>
          <button onClick={() => {}} type="submit" className="btn wd-100">
            Save
          </button>
        </form>
      </div>
    </FormProvider>
  );
};
const SimilarIncidents = ({ similarIncidents }) => {
  const [activeTab, setActiveTab] = useState("details");
  const [ir, setIr] = useState(similarIncidents[0]);
  const [search, setSearch] = useState("");
  const [irs, setIrs] = useState([
    {
      id: "1",
      sequence: "IR1/2/25",
      rootCause: "Policy to be updated",
      actionPlan: "Policy to be updated",
      category: "Medicine",
      status: "Accepted",
      actionTaken: "Policy approved in medication review.",
      details:
        "Meical administration policy does not inlcude medication transportation",
      dateTime: "2021-08-01T15:03",
    },
    {
      id: "2",
      sequence: "IR1/2/25",
      rootCause: "Policy to be updated",
      actionPlan: "Policy to be updated",
      category: "Medicine",
      status: "Accepted",
      actionTaken: "Policy approved in medication review.",
      details:
        "Meical administration policy does not inlcude medication transportation",
      dateTime: "2021-08-01T15:03",
    },
  ]);
  return (
    <div className={s.similarIncidents}>
      <Tabs
        secondary
        tabs={[
          { label: "INCIDENT DETAILS", value: "details" },
          { label: "SUMMARY", value: "summary" },
        ]}
        activeTab={activeTab}
        onChange={(tab) => {
          setActiveTab(tab.value);
        }}
      />
      <div className={`${s.incidents} ${s[activeTab]}`}>
        {activeTab === "details" && (
          <>
            <div className={s.sidebar}>
              <Input
                label="Add similar incident"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <ul>
                {similarIncidents.map((ir) => (
                  <li key={ir.id}>
                    <div className={s.detail}>
                      <p className={s.sequence}>{ir.sequence}</p>
                      <p>{ir.location}</p>
                      <p>
                        <Moment format="DD/MM/YYYY hh:mm">
                          {ir.incident_date_time}
                        </Moment>
                      </p>
                    </div>
                    <button className="btn clear" onClick={() => {}}>
                      <FaRegTrashAlt />
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            <div className={s.irView}>
              {ir ? "Preview IR" : "No IR selected"}
            </div>
          </>
        )}
        {activeTab === "summary" && (
          <>
            <section className={s.location}>
              <h4>Summary</h4>
              <section>
                <span className={s.label}>Location: </span>
                <p>
                  Nursing Station : 3 | Pediatric ward : 1 | Surgical ward : 1
                </p>
              </section>
              <section>
                <span className={s.label}>Incident Type: </span>
                <p>Near Miss : 3 | No Harm : 1 | Adverse : 1</p>
              </section>
            </section>
            <section>
              <h4>Root Cause Analysis - Category</h4>
              <Section label="Policy not available">
                <Table
                  className={s.policy}
                  columns={[
                    { label: "IR Code" },
                    { label: "Incident Date & Time" },
                    { label: "Root Cause" },
                    { label: "Details" },
                  ]}
                >
                  {irs.map((ir) => (
                    <tr key={ir.id}>
                      <td>{ir.sequence}</td>
                      <td>
                        <Moment format="DD/MM/YYYY hh:mm">{ir.dateTime}</Moment>
                      </td>
                      <td>{ir.rootCause}</td>
                      <td>{ir.details}</td>
                    </tr>
                  ))}
                </Table>
              </Section>
            </section>
            <section>
              <h4>Correct & Preventative Action plans</h4>
              <Table
                className={s.actionPlan}
                columns={[
                  { label: "IR Code" },
                  { label: "Incident Date & Time" },
                  { label: "Action Plan" },
                  { label: "Details" },
                  { label: "Category" },
                  { label: "Status" },
                  { label: "Action Taken" },
                ]}
              >
                {irs.map((ir) => (
                  <tr key={ir.id}>
                    <td>{ir.sequence}</td>
                    <td>
                      <Moment format="DD/MM/YYYY hh:mm">{ir.dateTime}</Moment>
                    </td>
                    <td>{ir.actionPlan}</td>
                    <td>{ir.details}</td>
                    <td>{ir.category}</td>
                    <td>{ir.status}</td>
                    <td>{ir.actionTaken}</td>
                  </tr>
                ))}
              </Table>
            </section>
          </>
        )}
      </div>
    </div>
  );
};
const ProblemAreas = ({ events }) => {
  const { ir, setIr } = useContext(InvestigationContext);
  const [edit, setEdit] = useState(null);

  const onSuccess = useCallback((newEv) => {
    // setEvents((prev) => {
    //   return prev.find((c) => c.id === newEv.id)
    //     ? prev.map((c) => (c.id === newEv.id ? newEv : c))
    //     : [...prev, newEv];
    // });
    setEdit(null);
  }, []);

  const { remove: deleteEvent, put: updateEvent, loading } = useFetch(
    defaultEndpoints.investigationEvents + "/{ID}"
  );
  const { patch: updateSequence, loading: updatingSequence } = useFetch(
    defaultEndpoints.investigationEvents + `/{ID}`
  );

  return (
    <Table
      className={s.problemAreas}
      key={Math.random()}
      columns={[{ label: "S.No." }, { label: "Details" }]}
    >
      {events.map((ev, i) => (
        <tr key={i}>
          <td>{ev.no}</td>
          <td>{ev.details}</td>
        </tr>
      ))}
    </Table>
  );
};

const RootCause = ({
  rcaRootcause,
  setRcaRootcause,
  rcaIdentified,
  setRcaIdentified,
}) => {
  const { ir } = useContext(InvestigationContext);
  const [rcas, setRcas] = useState([]);
  const [rootCauses, setRootCauses] = useState({
    // Environment: {
    //   Clocks: ["Inaccurate", "Don't agree"],
    //   Rounding: [],
  });

  const [edit, setEdit] = useState(null);
  const { get: getRcas } = useFetch(defaultEndpoints.rcas);

  useEffect(() => {
    const _rootCauses = {};
    if (rcaRootcause && rcas.length) {
      rcaRootcause
        .filter((item) => item.action !== "delete")
        .forEach((cause) => {
          const causeCat = rcas.find((rca) => rca.id === cause.causeCat);
          const cau = causeCat.rcaCauses.find((c) => c.id === cause.cause);
          _rootCauses[causeCat.name] = {
            ..._rootCauses[causeCat.name],
            ...(cau && {
              [cau.name]: {
                ...cause,
                id: cause.id,
                whys: cause.why.split("|"),
              },
            }),
          };
        });
      setRootCauses(_rootCauses);
    }
  }, [rcaRootcause, rcas]);
  useEffect(() => {
    getRcas().then(({ data }) => {
      if (data?._embedded) {
        setRcas(data._embedded.rca);
      }
    });
  }, []);
  return (
    <div className={s.rootCause}>
      <div className={s.problemStatement}>
        <ConnectForm>
          {({ register, formState: { errors } }) => {
            return (
              <Input
                label="Problem Statement"
                {...register("problemStatement", {
                  required: "Field is required",
                })}
                error={errors.problemStatement}
              />
            );
          }}
        </ConnectForm>
        <button className={`btn clear ${s.btn}`}>
          <FaUndo /> Root Causes of similar incidents
        </button>
      </div>
      <AddCauseFrom
        edit={edit}
        setEdit={setEdit}
        rcaRootcause={rcaRootcause}
        onSuccess={(data) => {
          setRcaRootcause((prev) =>
            edit
              ? prev.map((item) =>
                  item.id === data.id
                    ? {
                        ...data,
                        action: typeof data.id === "string" ? "add" : "edit",
                      }
                    : item
                )
              : [{ ...data, action: "add" }, ...prev]
          );
          setEdit(null);
        }}
        rcas={rcas}
      />
      {rcaRootcause.length > 0 && (
        <Causes
          causes={rootCauses}
          setRootCauses={setRcaRootcause}
          setEdit={setEdit}
        />
      )}
      <IdentifiedRca
        rcaIdentified={rcaIdentified}
        setRcaIdentified={setRcaIdentified}
        rootCauses={rcas}
      />
    </div>
  );
};
const AddCauseFrom = ({ edit, setEdit, rcaRootcause, onSuccess, rcas }) => {
  const {
    handleSubmit,
    register,
    unregister,
    control,
    reset,
    setValue,
    watch,
    formState: { errors },
    clearErrors,
  } = useForm({ shouldUnregister: true });
  const [whyIds, setWhyIds] = useState([Math.random().toString(32).substr(-8)]);
  const type = watch("type");

  useEffect(() => {
    if (edit) {
      const whys = edit.whys.reduce((p, c) => {
        p[Math.random().toString(32).substr(-8)] = c;
        return p;
      }, {});
      const values = {
        type: edit?.causeCat || "",
        cause: edit?.cause || "",
      };

      Object.entries(whys).forEach(([key, value]) => {
        values[`why.${key}`] = value;
      });

      setWhyIds(Object.keys(whys));
      reset(values);
    }
  }, [edit]);
  return (
    <form
      onSubmit={handleSubmit((values) => {
        onSuccess({
          causeCat: type,
          cause: values.cause,
          why: Object.values(values.why)
            .filter((item) => item)
            .map((item) => item.trim())
            .join("|"),
          id: edit?.id || Math.random().toString(32).substr(-8),
          action: edit?.id ? "edit" : "add",
        });
        reset({});
        setWhyIds([Math.random().toString(32).substr(-8)]);
      })}
      data-testid="addCauseForm"
    >
      <CustomRadio
        className={s.customRadio}
        selectedClassName={s.selected}
        name="type"
        formOptions={{ required: "Select cause category" }}
        register={register}
        setValue={setValue}
        watch={watch}
        onChange={(v) => {
          setValue("cause", "");
        }}
        options={rcas.map((rca) => ({
          label: rca.name,
          value: rca.id,
          causes: rca.rcaCauses,
        }))}
        error={errors.type}
      />
      <div className={s.addCause}>
        <Select
          label="Cause"
          name="cause"
          control={control}
          formOptions={{ required: "Select a cause" }}
          options={(rcas.find((rca) => rca.id === type)?.rcaCauses || []).map(
            (cause) => ({
              label: cause.name,
              value: cause.id,
              isDisabled: rcaRootcause.some((item) => item.cause === cause.id),
            })
          )}
          error={errors.cause}
        />
        {whyIds.map((id, i) => (
          <Input
            key={id}
            label={i === 0 ? "Why's" : ""}
            {...register(`why.${id}`)}
            error={errors[`why.${id}`]}
            icon={
              i > 0 ? (
                <FaTimes
                  onClick={() => {
                    unregister(`why.${id}`);
                    setWhyIds((prev) => prev.filter((_id) => _id !== id));
                  }}
                />
              ) : null
            }
          />
        ))}
        <button
          type="button"
          onClick={() =>
            setWhyIds((prev) => [
              ...prev,
              Math.random().toString(32).substr(-8),
            ])
          }
          className={`btn clear ${s.addWhy}`}
        >
          <FaPlusCircle />
        </button>
        <button type="submit" className="btn secondary wd-100">
          {edit ? "Update" : "Save"}
        </button>
        {edit && (
          <button
            type="button"
            onClick={() => {
              setWhyIds([Math.random().toString(32).substr(-8)]);
              reset({});
              setEdit(null);
            }}
            className="btn secondary wd-100"
          >
            Clear
          </button>
        )}
      </div>
    </form>
  );
};

const Causes = ({ causes, setRootCauses, setEdit }) => {
  const [showDiagram, setShowDiagram] = useState(false);
  return (
    <div className={s.causeBreakdown}>
      <button
        className={`btn clear ${s.btn}`}
        onClick={() => setShowDiagram(true)}
      >
        <FaExternalLinkAlt /> Generate Fishbone Diagram
      </button>
      <ul className={s.wrapper}>
        {Object.entries(causes).map(([key, cause]) => (
          <li key={key}>
            <p className={s.type}>{key}</p>
            <ul className={s.causes}>
              {Object.entries(cause).map(([key, { id, whys, ...rest }]) => (
                <li key={key} className={s.cause}>
                  <div className={s.causeLabel}>
                    <p>{key}</p>{" "}
                    <button
                      className={`btn clear ${s.btn}`}
                      onClick={() => setEdit({ ...rest, id, whys })}
                    >
                      <FaPencilAlt />
                    </button>
                    <button
                      className={`btn clear ${s.btn}`}
                      onClick={() =>
                        Prompt({
                          type: "confirmation",
                          question: "Are you sure want you delete this cause?",
                          callback: () => {
                            setRootCauses((prev) =>
                              typeof id === "string"
                                ? prev.filter((item) => item.id !== id)
                                : prev.map((item) =>
                                    item.id === id
                                      ? { ...item, action: "delete" }
                                      : item
                                  )
                            );
                          },
                        })
                      }
                    >
                      <FaRegTrashAlt />
                    </button>
                  </div>
                  {whys?.length > 0 && (
                    <ul className={s.whys}>
                      {whys.map((why, i) => (
                        <li key={i} className={s.why}>
                          {why}
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
      <Modal
        open={showDiagram}
        setOpen={setShowDiagram}
        head
        label="Fishbone Diagram"
      >
        <FishboneDiagram data={causes} />
      </Modal>
    </div>
  );
};

const IdentifiedRca = ({ rcaIdentified, setRcaIdentified, rootCauses }) => {
  const { ir } = useContext(InvestigationContext);

  const [edit, setEdit] = useState(null);
  return (
    <div>
      <p className={s.tableLable}>Identified Root Cause</p>
      <Table
        columns={[
          { label: "Root Cause" },
          { label: "Category" },
          { label: "Details" },
          { label: "Actions" },
        ]}
        className={s.rcaTeamMembers}
      >
        <tr>
          <td className={s.inlineForm}>
            <IdentifiedRcaForm
              key={edit ? "edit" : "add"}
              edit={edit}
              rootCauses={rootCauses}
              onSuccess={(data) => {
                setRcaIdentified((prev) =>
                  edit
                    ? prev.map((item) =>
                        item.id === data.id
                          ? {
                              ...data,
                              action:
                                typeof data.id === "string" ? "add" : "edit",
                            }
                          : item
                      )
                    : [{ ...data, action: "add" }, ...prev]
                );
                setEdit(null);
              }}
              clearForm={() => setEdit(null)}
            />
          </td>
        </tr>
        {rcaIdentified
          .filter((item) => item.action !== "delete")
          .map((rca) => (
            <tr key={rca.id}>
              <td>{rca.rootCause}</td>
              <td>
                {rootCauses.find((rc) => rc.id === rca.rcaCat)?.name ||
                  rca.rcaCat}
              </td>
              <td>{rca.details}</td>
              <TableActions
                actions={[
                  {
                    icon: <BsPencilFill />,
                    label: "Edit",
                    callBack: () => {
                      setEdit(rca);
                    },
                  },
                  {
                    icon: <FaRegTrashAlt />,
                    label: "Delete",
                    callBack: () =>
                      Prompt({
                        type: "confirmation",
                        message: `Are you sure you want to remove this root cause?`,
                        callback: () => {
                          setRcaIdentified((prev) =>
                            prev
                              .map((item) =>
                                item.id === rca.id
                                  ? typeof rca.id === "string"
                                    ? null
                                    : { ...rca, action: "delete" }
                                  : item
                              )
                              .filter((item) => item)
                          );
                        },
                      }),
                  },
                ]}
              />
            </tr>
          ))}
      </Table>
    </div>
  );
};
const IdentifiedRcaForm = ({ edit, rootCauses, onSuccess, clearForm }) => {
  const { ir, setIr } = useContext(InvestigationContext);
  const {
    handleSubmit,
    register,
    reset,
    control,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    reset({ ...edit });
  }, [edit]);
  return (
    <form
      onSubmit={handleSubmit(async (values) => {
        onSuccess({
          ...values,
          incidentReport: { id: ir.id },
          id: edit?.id || Math.random().toString(32).substr(-8),
        });
        reset({
          rootCause: "",
          rcaCat: "",
          details: "",
        });
      })}
      data-testid="identifiedRootCause"
    >
      <Input
        {...register("rootCause", { required: "Field is required" })}
        error={errors.rootCause}
      />
      <Select
        options={rootCauses.map((rca) => ({ label: rca.name, value: rca.id }))}
        name="rcaCat"
        control={control}
        formOptions={{ required: "Field is required" }}
      />
      <Input
        {...register("details", { required: "Field is required" })}
        error={errors.details}
      />
      <div className={s.btns}>
        <button className="btn secondary" type="submit">
          {edit ? (
            <FaCheck />
          ) : (
            <>
              <FaPlus /> Add
            </>
          )}
        </button>
        {edit && (
          <button
            type="button"
            onClick={() => clearForm(null)}
            className="btn secondary"
            data-testid="identifiedRootCauseClose"
          >
            <IoClose />
          </button>
        )}
      </div>
    </form>
  );
};

const RcaTeamMembers = ({ rcaTeam, setRcaTeam, parameters }) => {
  const [edit, setEdit] = useState(null);
  return (
    <Table
      columns={[
        { label: "Name" },
        { label: "Department" },
        { label: "Designation" },
        { label: "Actions" },
      ]}
      className={s.rcaTeamMembers}
    >
      <tr>
        <td className={s.inlineForm}>
          <RcaTeamMemberForm
            key={edit ? "edit" : "add"}
            edit={edit}
            parameters={parameters}
            onSuccess={(data) => {
              setRcaTeam((prev) =>
                edit
                  ? prev.map((item) =>
                      item.id === data.id
                        ? {
                            ...data,
                            action:
                              typeof data.id === "string" ? "add" : "edit",
                          }
                        : item
                    )
                  : [{ ...data, action: "add" }, ...prev]
              );
              setEdit(null);
            }}
            clearForm={() => setEdit(null)}
          />
        </td>
      </tr>
      {rcaTeam
        .filter((item) => item.action !== "delete")
        .map((member) => (
          <tr key={member.id}>
            <td>
              {parameters.users.find((user) => user.value === member.userName)
                ?.label || member.userName}
            </td>
            <td>
              {parameters.departments.find((user) => user.value === member.dept)
                ?.label || member.dept}
            </td>
            <td>{member.designation}</td>
            <TableActions
              actions={[
                {
                  icon: <BsPencilFill />,
                  label: "Edit",
                  callBack: () => {
                    setEdit(member);
                  },
                },
                {
                  icon: <FaRegTrashAlt />,
                  label: "Delete",
                  callBack: () =>
                    Prompt({
                      type: "confirmation",
                      message: `Are you sure you want to remove this note?`,
                      callback: () => {
                        setRcaTeam((prev) =>
                          prev
                            .map((item) =>
                              item.id === member.id
                                ? typeof member.id === "string"
                                  ? null
                                  : { ...member, action: "delete" }
                                : item
                            )
                            .filter((item) => item)
                        );
                      },
                    }),
                },
              ]}
            />
          </tr>
        ))}
    </Table>
  );
};
const RcaTeamMemberForm = ({ edit, onSuccess, parameters, clearForm }) => {
  const { ir, setIr } = useContext(InvestigationContext);
  const {
    handleSubmit,
    register,
    reset,
    control,
    setValue,
    watch,
    formState: { errors },
  } = useForm();

  const [user, setUser] = useState(null);

  useEffect(() => {
    reset({ ...edit });
  }, [edit]);

  return (
    <form
      onSubmit={handleSubmit(async (values) => {
        onSuccess({
          ...values,
          id: edit?.id || Math.random().toString(32).substr(-8),
        });
        reset({ userId: "", deptId: "", designation: "" });
      })}
      data-testid="irTeamMemberForm"
    >
      <Select
        options={parameters.users}
        name="userName"
        control={control}
        formOptions={{ required: "Field is required" }}
        onChange={(user) => {
          if (user.department) {
            setValue("dept", user.department);
          }
          if (user.designation) {
            setValue("designation", user.designation);
          }
          setUser(user);
        }}
      />
      <Select
        options={parameters.departments}
        name="dept"
        control={control}
        formOptions={{ required: "Field is required" }}
        readOnly={user?.department}
      />
      <Input
        {...register("designation", { required: "Field is required" })}
        error={errors.designation}
        readOnly={user?.designation}
      />
      <div className={s.btns}>
        <button className="btn secondary" type="submit">
          {edit ? (
            <FaCheck />
          ) : (
            <>
              <FaPlus /> Add
            </>
          )}
        </button>
        {edit && (
          <button
            type="button"
            onClick={() => clearForm(null)}
            className="btn secondary"
            data-testid="irTeamMemberFormClose"
          >
            <IoClose />
          </button>
        )}
      </div>
    </form>
  );
};

const Section = ({ label, children }) => {
  const [open, setOpen] = useState(true);
  return (
    <section className={s.collapsableSection}>
      <button
        className={`btn clear ${s.header}`}
        onClick={() => setOpen(!open)}
      >
        {open ? <FaMinusCircle /> : <FaPlusCircle />} {label}
      </button>
      {open && <div className={s.content}>{children}</div>}
    </section>
  );
};

export default Rca;
