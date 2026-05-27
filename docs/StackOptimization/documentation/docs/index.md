# Stack optimization

---

## Stack implementation considerations

AUTOSAR defines several parameters to deal with stack size and behavior of the OS but the implementation of these is up 
to the OS vendors.

Three common solutions are observed in these OSes:

- individual stacks with no possibility to share the stack among tasks
- individual stacks with the possibility to share
- common stack, which allows sharing by definition

Although both individual and common stack implementations facilitate stack sharing, the common stack solution is 
considered superior performance-wise as there is no stack pointer reprogramming and caching is more effective due to 
spatial locality of the stack accesses.

---

## The classic/default setup

N tasks + N priorities + N stacks equals a lot of wasted resources, yet these are more frequent than one would expect.
The current template will demonstrate the impact of such default setup and proposes three alternative solutions with
a short analysis of each.

!!! tip "Default stack size of ISRs"
    ISRs are typically fast, with just a couple of lines of code and reduced set of data to operate on. Make sure that
    you are right-sizing the ISR stack and do not leave unnecessarily high (task-like) values!

The reference project contains eight tasks and one interrupt configured as follows. The tasks are in descending order
of priorities:

<div class="center-table" markdown>

| Task  | Priority | Stack size |
| :--- | :---: | :---: |
| `TimerISR`          | -  | 64 B | 
| `InitTask`          | 10 | 4 kB |
| `InitTask_WdgM`     | 8  | 1 kB |
| `OsTask_1ms`        | 6  | 8 kB |
| `OsTask_10ms`       | 5  | 8 kB |
| `OsTask_100ms`      | 4  | 8 kB |
| `OsTask_MS`         | 3  | 4 kB |
| `OsTask_DRE_ASW`    | 2  | 8 kB |
| `OsTask_Background` | 1  | 1 kB |
| Total               |    | 42 kB |

</div>

This setup will consume 43072 B of stack, a significant value in the world of embedded devices.

---

## Optimization 

### Task groups

AUTOSAR OSes inherit the concept of internal resources from OSEK/VDX. Internal resources are similar to standard 
resources except occupying and releasing the resource is done automatically by the OS upon entering/exiting the task. 
Tasks which reference the same internal resource are subject the priority ceiling protocol. Tasks part of a group cannot 
be preempted by each other, only by tasks of higher priority than the group's highest priority.

!!! tip "Internal resources and ISRs"
    OSEK/VDX and AUTOSAR allow accessing `GetResource()`/`ReleaseResource()` in the context of CAT2 interrupts but 
    internal resources are limited to tasks only. Certain OS vendors do offer extensions which allow the usage of 
    internal resources with ISRs too, thus grouping is possible between ISRs and tasks. Check with your OS vendor
    for details!

Let's assume three task groups for our example project: init tasks, cyclic tasks, event tasks; we will map them as
follows:

    - INIT_TASKS: InitTask, InitTask_WdgM
    - CYCLIC_TASKS: OsTask_1ms, OsTask_10ms, OsTask_100ms
    - EVENT_TASKS: OsTask_MS, OsTask_DRE_ASW, OsTask_Background

As the tasks in the same group cannot preempt each other, it is sufficient to allocate a single stack for all the tasks
in the group, picking the largest size of the group:

- `INIT_TASKS`: 4 kB
- `CYCLIC_TASKS`: 8 kB
- `EVENT_TASKS`: 8 kB

The total of 20 kB of stack is a **more than 50% reduction** in stack size need compared to the default setup.

The trade-off of such scheduling is potential timing problems: lower priority, long-running tasks can prevent higher
priority tasks from executing within a group.

!!! tip "Task group vs. tasks with same priority"
    One would think that creating task groups can be achieved by assigning the same priority to the tasks in that group.
    Although the stack saving and preemption between different groups would work the same, there is a subtle but important
    difference when it comes to the tasks in the same group. Task groups with internal resources will still obey the task
    priorities inside the group, whereas tasks with the same priority will be scheduled based on the activation order
    relative to each other.

---

### Non-preemptive scheduling
This technique implies that no task can preempt another running task. It can be seen as an extreme case of task grouping
where there is a single group only. As there is only a single group, this would require 8 kB of stack in our example
project.

This solution can achieve more than 80% stack reduction but it does not come for free: task timing can suffer to the point
the non-preemptive scheduling might not be feasible to deploy at all.

---

### Cooperative multitasking
Cooperative multitasking alleviates the timing impact of non-preemptive scheduling by allowing tasks to introduce schedule
points otherwise known as yielding. If a higher-priority task is in the *READY* state, calling the `Schedule()` API will
put the calling task in READY state and execute the higher-priority one.
Calls to `Schedule()` can be placed in multiple locations of the task, allowing better control over the timing of the
system.

## How-to
1. The first step is to have a closer look to your OS applications and tasks. Common scenarios include groupin task 
belonging to:
    - the same application (e.g. all tasks of OsApp1)
    - different applications but sharing the same period (e.g. all tasks with a 5ms period)
    - different applications sharing the same safety classification (e.g. all apps of ASIL-D context vs all apss belonging to a QM context)
2. Once the grouping is identified, create the internal resources representing each group. Note that OSEK, and, by extension, 
AUTOSAR, allows only one internal resource per task.
3. Create the references from the tasks to their internal resource. Regenerate OS.
4. Verify the scheduling of the software.
