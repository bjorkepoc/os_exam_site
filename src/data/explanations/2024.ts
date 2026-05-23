export type ChoiceGroupExplanation = {
  correctIndex: number;
  correct: string;
  wrong: Record<number, string>;
};

export const explanations2024: Record<string, ChoiceGroupExplanation> = {
  "2024-q01": {
    correctIndex: 2,
    correct:
      "A microkernel keeps only the minimum trusted mechanisms in kernel mode, such as scheduling, low-level address-space management, and IPC. Services like file systems, drivers, and network stacks are moved into user-space servers, so the option describing a small kernel plus user-space services matches the design.",
    wrong: {
      0: "Linux is not the representative example here. The mainstream Linux kernel is monolithic: most core OS services and drivers run in kernel space, even though Linux supports loadable modules.",
      1: "A microkernel is not defined by being less reliable. Moving services out of kernel space can improve fault isolation because a crashed user-space service is less likely to take down the whole kernel.",
      3: "A single layer with all OS services in kernel space describes a monolithic kernel, not a microkernel. It is almost the opposite architectural choice.",
    },
  },
  "2024-q02": {
    correctIndex: 0,
    correct:
      "A process has one scheduler-visible state at a time, for example running, runnable/ready, blocked/sleeping, or terminated. The state can change over time, but at any instant the OS treats it as being in one state for scheduling and accounting.",
    wrong: {
      1: "A process becomes blocked when it cannot continue until an event occurs, such as I/O completion, a lock becoming available, or a child changing state. When execution is done, the process exits or becomes a zombie/terminated, not blocked.",
      2: "A process may have many attributes, but its process-state field is not simultaneously running and blocked. Some threads inside a process can be in different states, but this question is about a process state.",
      3: "Processes do not all start in the running state. A newly created process is usually made ready/runnable and only enters running when the scheduler actually dispatches it on a CPU.",
    },
  },
  "2024-q03": {
    correctIndex: 1,
    correct:
      "The false statement is that processes cannot communicate with each other. Processes are isolated by default, but operating systems deliberately provide IPC mechanisms such as pipes, sockets, shared memory, signals, and files so processes can exchange data or synchronize.",
    wrong: {
      0: "A process is exactly a program in execution: code plus its current registers, address space, open files, and other OS-managed resources.",
      2: "Context switching is the OS mechanism for saving the current execution context and restoring another one so the CPU can move between processes or threads.",
      3: "Processes normally have their own virtual address spaces and resource tables. That isolation is one of the key differences from threads in the same process.",
    },
  },
  "2024-q04": {
    correctIndex: 0,
    correct:
      "Processes are independent execution containers with separate address spaces, while threads are execution flows inside one process. Threads in the same process share the process resources, which makes communication cheaper but also makes data races possible.",
    wrong: {
      1: "Creating a process is usually more expensive than creating a thread because a process needs a separate address space and more kernel bookkeeping. Threads are designed to be lighter-weight execution contexts.",
      2: "This reverses the usual relationship. Threads in the same process share memory; separate processes do not share address space unless the OS is asked to set up shared memory.",
      3: "Threads do share CPU scheduling and process resources such as memory mappings and open files. Processes can also share some resources explicitly, so this option is too absolute and does not identify the main distinction.",
    },
  },
  "2024-q05": {
    correctIndex: 0,
    correct:
      "Round-robin with quantum 5 performs worst for this task set because every job is repeatedly preempted before it can finish, creating long completion times for all jobs. The solution key's average turnaround calculations are STCF 23.75, SJF 23.75, FIFO 24.5, and RR 34.5, so RR has the largest average turnaround time.",
    wrong: {
      1: "Shortest-time-to-completion-first always runs the job with the least remaining time. In this task set it lets short remaining jobs finish earlier and ties the best average turnaround time in the solution key.",
      2: "Shortest-job-first also favors shorter execution times. Given the arrivals here, it avoids the repeated preemption overhead and delayed completions that make round-robin worse.",
      3: "FIFO is not optimal for turnaround time, but for this specific set its average turnaround time is still below round-robin's. It runs each job to completion in arrival order instead of rotating all jobs through many short quanta.",
    },
  },
  "2024-q06": {
    correctIndex: 1,
    correct:
      "Linux CFS tries to approximate fair sharing by tracking each task's virtual runtime. A task that has received less normalized CPU time has lower vruntime and is favored, so CPU time converges toward a fair distribution while still accounting for weights/nice values.",
    wrong: {
      0: "Fixed time slices and fixed priority levels describe a more traditional priority or round-robin scheduler. CFS does not primarily schedule by a fixed quantum per priority level.",
      2: "Scheduling strictly by arrival time is FIFO/FCFS behavior. CFS chooses by virtual runtime, not by which task entered the run queue first.",
      3: "Static priority with preemptive scheduling misses the core CFS mechanism. CFS uses weights to influence virtual runtime rather than simply always choosing the highest static priority task.",
    },
  },
  "2024-q07": {
    correctIndex: 1,
    correct:
      "Place 2 is inside the scheduler's test for a runnable process and immediately around the point where xv6 is about to context-switch to that process. That is where scheduling-policy code can decide which runnable process should be selected before swtch transfers the CPU.",
    wrong: {
      0: "Place 4 is not the right point to choose the next process if it is outside the runnable-process selection path or after the scheduler has already committed to a process. Policy decisions must happen before the context switch.",
      2: "Place 1 is too early or at the wrong scope for choosing a concrete runnable process. At that point the scheduler has not yet reached the per-process runnable check where the selected process is dispatched.",
      3: "Place 3 is not where the scheduler should add the core selection decision if it is after the chosen process has already been prepared or switched. It would observe the decision rather than make it cleanly.",
    },
  },
  "2024-q08": {
    correctIndex: 1,
    correct:
      "A virtual address is the address generated by the CPU as a program executes load, store, and instruction-fetch operations. The memory-management unit translates that virtual address through page tables or TLB entries to a physical address in RAM chosen by the OS's memory management.",
    wrong: {
      0: "Virtual addresses are not always numerically larger than physical addresses. Their sizes and values depend on the architecture and configuration, and translation is not based on a simple greater-than relationship.",
      2: "A physical address refers to a location in main memory, not disk. Disk blocks may back virtual memory during paging, but they are not physical memory addresses.",
      3: "This reverses the normal roles. Applications use virtual addresses, while hardware and the kernel ultimately deal with physical addresses when accessing RAM and devices.",
    },
  },
  "2024-q09": {
    correctIndex: 0,
    correct:
      "Statements 1, 3, and 4 are true. An address space abstracts the memory a process can see; the code/text segment is a relatively static part containing executable instructions; and stack discipline is last-in-first-out for call frames and local storage.",
    wrong: {
      1: "This omits statement 4, which is true because stack frames are pushed and popped in LIFO order as functions call and return.",
      2: "This omits statement 1, the central definition of an address space as the process's abstract view of memory.",
      3: "This includes statement 2, which is false. Function arguments and local variables are normally stored in stack frames, while the heap is for dynamically allocated objects such as malloc/new allocations.",
    },
  },
  "2024-q10": {
    correctIndex: 2,
    correct:
      "Statements 3 and 4 are true. Paging can waste space inside the last page of an allocation, which is internal fragmentation, and a virtual page and physical page frame must have the same size so page-number to frame-number translation preserves the page offset.",
    wrong: {
      0: "This misses statement 4. Page and frame size equality is required for normal paging because the offset bits are copied unchanged from the virtual address to the physical address.",
      1: "This includes statement 2, which is false in the sense tested here. Multi-level paging reduces page-table memory usage for sparse address spaces, but it can add extra page-table lookups rather than improving access speed by itself.",
      3: "This includes statement 1, which is false. Paging is an address-translation and memory-management technique; it does not make physical memory itself process data faster.",
    },
  },
  "2024-q11": {
    correctIndex: 3,
    correct:
      "The TLB is a cache of recent virtual-page to physical-frame translations. On a TLB hit, the processor avoids walking the page table, so virtual-to-physical translation is much faster for recently used pages.",
    wrong: {
      0: "Allocating physical frames is the job of the OS memory manager and page allocator, not the TLB. The TLB only caches translations after they exist.",
      1: "The TLB does not eliminate page tables. It accelerates common translations, but TLB misses still require a page-table walk or OS refill path.",
      2: "Caching page contents to reduce disk I/O is a page cache or buffer-cache role. The TLB stores address-translation metadata, not copies of pages.",
    },
  },
  "2024-q12": {
    correctIndex: 2,
    correct:
      "The page offset is determined by the page size: a 4KB page is 4096 bytes, which is 2^12, so it needs 12 offset bits. A 1KB page is 1024 bytes, which is 2^10, so it needs 10 offset bits.",
    wrong: {
      0: "16 and 14 would correspond to 64KB and 16KB pages, not to 4KB and 1KB pages. The offset bits count bytes within one page.",
      1: "12 is correct for 4KB, but 11 would describe a 2KB page. Reducing the page to 1KB leaves only 10 byte-offset bits.",
      3: "10 is correct for 1KB, not for the original 4KB page. A 4KB page needs two more offset bits than a 1KB page.",
    },
  },
  "2024-q13": {
    correctIndex: 0,
    correct:
      "The condition variable lets a thread sleep until the shared-state predicate it cares about may have changed. Producers wait while the buffer is full, consumers wait while it is empty, and signal wakes a waiter so it can re-check the predicate while holding the lock.",
    wrong: {
      1: "A condition variable does not make simultaneous buffer modification safe or faster. It is a waiting/signaling mechanism, and safe modification still requires mutual exclusion.",
      2: "The lock, not the condition variable, enforces one-thread-at-a-time access to the buffer data structure. The condition variable cooperates with the lock to sleep and wake correctly.",
      3: "Producer and consumer may run in parallel when they are not touching the critical section. The goal is to wait for buffer state changes, not to forbid all overlap between producer and consumer execution.",
    },
  },
  "2024-q14": {
    correctIndex: 3,
    correct:
      "The lock protects the buffer and the condition checks as one critical section. Without it, two threads could both observe the same buffer state and then add or remove concurrently, corrupting the buffer or losing items.",
    wrong: {
      0: "Allowing simultaneous access to the buffer is exactly what the lock prevents. Throughput is useful only if the shared data structure remains correct.",
      1: "The lock is not a scheduler policy that forces producers before consumers. It protects shared state regardless of which type of thread runs first.",
      2: "Preventing the producer from ever executing before the consumer would be wrong: if the buffer is empty, the producer must be able to run and add an item.",
    },
  },
  "2024-q15": {
    correctIndex: 3,
    correct:
      "The code is not correct for multiple consumers because it uses one condition variable for both 'not full' and 'not empty' conditions. A consumer can signal and wake another consumer even though the buffer is still empty, so the awakened consumer goes back to sleep; with unlucky wakeups, the system can fail to wake the producer that could make progress.",
    wrong: {
      0: "It does not work perfectly with multiple consumers because the single condition variable mixes producer and consumer wait conditions. Correct bounded-buffer designs usually use separate conditions or semaphores for empty slots and full slots.",
      1: "The issue described by the solution is not the producer overwriting its own data. The lock and 'while full' check are aimed at protecting against overflow.",
      2: "The while-loop around 'buffer is empty' prevents two consumers from safely taking the same item after a wakeup: each awakened consumer must re-check the predicate under the lock. The real bug is waking the wrong class of waiter.",
    },
  },
  "2024-q16": {
    correctIndex: 2,
    correct:
      "For a bounded buffer, the producer must wait for an empty slot and the consumer must wait for a filled slot. Therefore one semaphore is initialized to MAX for available empty slots and waited on by producers, while the other is initialized to 0 for available items and waited on by consumers.",
    wrong: {
      0: "This reverses the semaphores. If the producer waits on a semaphore initialized to 0, producers would block immediately even though the empty buffer has MAX free slots.",
      1: "One semaphore initialized to 0 can count filled items, but it cannot also count available empty slots. Multiple producers and consumers need both capacity control and item availability, plus a lock for the buffer mutation.",
      3: "One semaphore initialized to MAX can count empty slots, but it cannot make consumers wait for actual items. Consumers need a separate filled-slots semaphore initialized to 0.",
    },
  },
  "2024-q17": {
    correctIndex: 3,
    correct:
      "All listed statements are false. A binary lock semaphore should start at 1 so the first caller can acquire it; a wait that decrements the value to exactly 0 has acquired the last available permit and need not sleep; and the standard semaphore operations are wait/down/P and post/up/V, not a required third operation called ready.",
    wrong: {
      0: "A lock semaphore initialized to 0 starts unavailable, so every thread trying to acquire the lock would block until someone posts without owning it. A free binary lock is initialized to 1.",
      1: "The caller sleeps when wait finds no available permits, usually when the value would be negative or is zero before acquisition depending on the implementation model. Becoming zero after a successful wait means the caller acquired the last permit.",
      2: "Semaphores are defined around wait and post operations. Some systems have additional helpers, but 'ready' is not one of the core semaphore operations.",
    },
  },
  "2024-q18": {
    correctIndex: 2,
    correct:
      "The micro-controller is not one of the standard programmer-visible interface registers of an I/O device. Device interfaces are typically described in terms of data, status, and command/control registers that the CPU or driver reads and writes.",
    wrong: {
      0: "A data register is a normal I/O interface component because it holds bytes or words transferred between the device and the CPU.",
      1: "A status register belongs to the device interface because it reports state such as ready, busy, error, or completion.",
      3: "A command register is part of the interface because the driver writes commands there to tell the device what operation to perform.",
    },
  },
  "2024-q19": {
    correctIndex: 0,
    correct:
      "DMA lets an I/O device transfer blocks directly to or from main memory after the CPU sets up the operation. This avoids forcing the CPU to copy every word itself, so the CPU can do other work while the device and memory controller perform the transfer.",
    wrong: {
      1: "DMA is specifically used so the CPU does not directly manage every memory transfer. The CPU still configures the operation and handles interrupts, but it is not in the data path for each byte.",
      2: "DMA does not increase storage capacity. It changes how data moves between a device and memory.",
      3: "DMA does not make peripheral devices more computationally powerful. Its main benefit is lower CPU overhead and more efficient bulk transfer.",
    },
  },
  "2024-q20": {
    correctIndex: 2,
    correct:
      "The false statement is that HDDs are byte-addressable. Hard disks expose block or sector-level access; the OS reads and writes sectors or groups of sectors, not arbitrary individual bytes as independent physical disk addresses.",
    wrong: {
      0: "Higher RPM generally lowers rotational latency and can improve throughput, so this is a reasonable true statement about HDD performance.",
      1: "Sectors are the fundamental addressable storage units on HDDs. File systems and block layers build larger abstractions on top of sector/block access.",
      3: "HDDs can have multiple platters, each with magnetic surfaces used to store data. This is a standard part of disk construction.",
    },
  },
  "2024-q21": {
    correctIndex: 3,
    correct:
      "SSD flash cells have finite program/erase endurance. Intensive writes consume those cycles; wear leveling spreads the writes out, but it cannot make the cells writable forever.",
    wrong: {
      0: "SSD writes are not generally slower than HDD writes, and write speed alone is not the reason for reduced lifetime. The lifetime issue is flash-cell wear.",
      1: "SSDs have no spinning platters or moving heads, so mechanical wear-out is not the main explanation. HDDs are the devices with significant mechanical wear concerns.",
      2: "SSDs do not require frequent defragmentation; defragmenting an SSD is usually unnecessary and adds avoidable writes. Fragmentation is a performance issue for mechanical seek patterns, not a core SSD lifetime requirement.",
    },
  },
  "2024-q22": {
    correctIndex: 0,
    correct:
      "In xv6, proc.ofile[] stores pointers to the open-file objects used by that process, so statement 1 is true. The struct file objects describe open-file state such as type, reference count, readability/writability, inode pointer, and offset; they are open-file objects shared through the system file table, so statement 4 is the intended true description here.",
    wrong: {
      1: "Statement 2 is false because struct file does not store path strings for all open files. Paths are resolved during lookup; open-file state is represented by file objects and inode references.",
      2: "Statement 5 is false because a process's ofile[] array is per-process, not a list of every open file in every process. The option also omits statement 4's open-file-structure point.",
      3: "Statement 3 is misleading as phrased: struct file may point to an inode for inode-backed files, but it does not store all inodes of all open files. Pairing it with statement 4 is therefore not the intended correct answer.",
    },
  },
  "2024-q23": {
    correctIndex: 2,
    correct:
      "In Unix-like systems, file descriptors 0, 1, and 2 are conventionally reserved for standard input, standard output, and standard error. If this is the first additional successful open in the process, open returns the lowest unused descriptor, so f is 3.",
    wrong: {
      0: "f would not normally be 0 for the first file opened by a normal process because descriptor 0 is already standard input. It would only be reused if stdin had been closed.",
      1: "The integer returned by open is a file descriptor, not an inode number. The descriptor indexes the process's open-file table, which eventually refers to file and inode structures inside the kernel.",
      3: "The returned descriptor does not store the path name. Path lookup is used to find the file; after open, the descriptor refers to kernel open-file state.",
    },
  },
  "2024-q24": {
    correctIndex: 3,
    correct:
      "To open /foo/test.txt, the system starts at the root inode, reads the root directory data block to find foo, reads foo's inode, reads foo's directory data block to find test.txt, and then reads test.txt's inode. Opening the file does not require reading the file's data block, so the correct order is 3, 6, 2, 5, 1.",
    wrong: {
      0: "This adds step 4, the data block of test.txt. That block is needed when reading file contents, but open only needs enough metadata to create the open-file entry.",
      1: "This starts at foo and omits the root directory lookup. For an absolute path, resolution begins at /, so the root inode and root data block must be consulted first.",
      2: "This both starts too late and includes the file data block. Path resolution needs root and foo directory metadata, not the target file's contents.",
    },
  },
};

export default explanations2024;
