export type ChoiceOptionIndex = 0 | 1 | 2 | 3;

export interface ChoiceGroupExplanation {
  correctIndex: ChoiceOptionIndex;
  correct: string;
  wrong: Partial<Record<ChoiceOptionIndex, string>>;
  uncertainty?: string;
}

// Explanations are keyed by the choice group ids in generatedExamManifest.ts.
// The numeric keys in `wrong` are option indexes from the source PDF order.
export const explanations2025 = {
  "2025-q01": {
    correctIndex: 1,
    correct:
      "A microkernel best matches the requirement for minimal kernel space. It keeps only essential mechanisms, such as low-level scheduling, address-space control, traps, and IPC, in kernel mode while moving services such as drivers and file systems to user space.",
    wrong: {
      0: "A layered kernel is a way to organize OS code into layers, but the layers can still all be kernel-resident. Layering alone does not imply a minimal kernel.",
      2: "A monolithic kernel puts most OS services in kernel space, including process management, memory management, file systems, and many drivers. That is the opposite of the stated goal.",
      3: "A hybrid kernel mixes approaches and often keeps more service code in kernel space for performance, so it is not the clean minimal-kernel design asked for here.",
    },
  },
  "2025-q02": {
    correctIndex: 2,
    correct:
      "A system call is the controlled interface through which a user program asks the kernel to perform privileged work, such as creating a process, opening a file, or changing an address-space mapping.",
    wrong: {
      0: "Hardware instructions can help implement synchronization or trigger traps, but the system call is the OS service request made across the user/kernel boundary.",
      1: "A shell command is a user-level action. The command may eventually execute code that invokes system calls, but it is not itself the system call abstraction.",
      3: "A standard-library function may wrap a system call, but many library functions run entirely in user space. The system call is the kernel-facing request.",
    },
  },
  "2025-q03": {
    correctIndex: 2,
    correct:
      "A process is a program in execution: the program image plus runtime state such as registers, program counter, address space, open files, scheduling state, and identifiers.",
    wrong: {
      0: "A program on disk is passive executable data. It becomes a process only after the OS loads it and gives it execution state.",
      1: "A system call is an interface to the kernel, not the abstraction for a running program.",
      3: "A process has memory, but it is not just a memory block. The OS also tracks CPU state, resources, and scheduling metadata.",
    },
  },
  "2025-q04": {
    correctIndex: 0,
    correct:
      "Disk size is not part of a process control block. A PCB stores per-process execution and management state, not global storage-device capacity.",
    wrong: {
      1: "The program counter is part of the execution context that must be saved and restored when the OS switches processes.",
      2: "The process ID is essential PCB metadata because it identifies the process to the kernel and user programs.",
      3: "The page table, or a pointer to it, belongs with process address-space metadata so the OS can run the process with the right virtual memory mappings.",
    },
  },
  "2025-q05": {
    correctIndex: 2,
    correct:
      "fork() is the Unix-like system call that creates a child process by duplicating the calling process's context, producing separate parent and child return paths.",
    wrong: {
      0: "pthread_create() creates a thread inside the same process, not a separate process with its own PID.",
      1: "createprocess() is not the Unix-like process creation call in this course context; it resembles the Windows CreateProcess API.",
      3: "exec() replaces the current process image with a new program. It does not create a new process by itself.",
    },
  },
  "2025-q06": {
    correctIndex: 3,
    correct:
      "exec() overlays the current process with a new program. If it succeeds, the PID remains the same but the old code, data, heap, stack, and entry point are replaced.",
    wrong: {
      0: "Terminating a process is done with exit() or a fatal signal, not exec().",
      1: "Creating a child process is fork()'s job. exec() runs inside an already existing process.",
      2: "Creating a new process with a new program describes fork() followed by exec(), or a create-process API, not exec() alone.",
    },
  },
  "2025-q07": {
    correctIndex: 2,
    correct:
      "A process is the OS resource and protection container for a running program, while a thread is a schedulable execution stream inside that process. Threads share the process address space but have their own CPU execution state.",
    wrong: {
      0: "Normal processes do not automatically share memory; they are isolated by separate address spaces unless shared memory is explicitly created. Threads in the same process are the ones that normally share memory.",
      1: "The OS scheduler and CPU execution machinery deal with both processes and threads depending on the implementation. This option invents the wrong management distinction.",
      3: "A thread normally does not have its own address space. It has its own stack, registers, and program counter within the process address space.",
    },
  },
  "2025-q08": {
    correctIndex: 3,
    correct:
      "Global variables live in the process address space, so threads of the same process share them by default. That is why concurrent accesses to globals often need synchronization.",
    wrong: {
      0: "Register values are per-thread execution context and must be saved separately for each thread.",
      1: "Each thread needs its own stack for calls, return addresses, and local variables.",
      2: "The program counter is per thread because different threads can be executing different instructions.",
    },
  },
  "2025-q09": {
    correctIndex: 3,
    correct:
      "Shortest Job First is optimal for minimizing average waiting time in the non-preemptive case when job lengths are known, because short jobs do not wait behind long jobs unnecessarily.",
    wrong: {
      0: "STCF is the preemptive shortest-remaining-time policy. The question asks specifically for a non-preemptive algorithm.",
      1: "FIFO can create the convoy effect, where short jobs wait behind long jobs, increasing average waiting time.",
      2: "Round-Robin is a time-sharing policy aimed at responsiveness and fairness, not optimal average waiting time with known job lengths.",
    },
  },
  "2025-q10": {
    correctIndex: 1,
    correct:
      "With a very large Round-Robin quantum, a process usually finishes before being preempted. The ready queue is then served in arrival order, which behaves like FIFO.",
    wrong: {
      0: "STCF requires choosing the process with the shortest remaining time. A large RR quantum does not inspect remaining times.",
      2: "SJF requires selecting by total job length. A large quantum only removes most preemption; it does not sort jobs by length.",
      3: "Priority scheduling depends on priority values. Round-Robin with a large quantum still follows queue order.",
    },
  },
  "2025-q11": {
    correctIndex: 2,
    correct:
      "If the time slice is too small, the OS spends too much time context switching: saving/restoring registers, running the scheduler, and disturbing caches instead of executing user work.",
    wrong: {
      0: "Round-Robin usually reduces starvation because every runnable process repeatedly receives CPU time.",
      1: "Deadlock depends on resource-waiting conditions, not on the size of the CPU scheduling quantum.",
      3: "Waiting time may be affected, but the direct and characteristic problem of a tiny quantum is context-switching overhead.",
    },
  },
  "2025-q12": {
    correctIndex: 0,
    correct:
      "Interactive processes benefit most because Round-Robin gives runnable tasks frequent turns, improving response time compared with waiting for a long FIFO or STCF-selected CPU burst to finish.",
    wrong: {
      1: "Kernel-mode execution is not the workload class that Round-Robin is meant to improve.",
      2: "I/O-heavy tasks often block waiting for devices. They may benefit from scheduling, but the classic RR response-time win is for interactive tasks.",
      3: "Long CPU-bound jobs often suffer more preemption and may have worse turnaround under RR.",
    },
  },
  "2025-q13": {
    correctIndex: 0,
    correct:
      "The memory management unit is the hardware that translates virtual addresses to physical addresses and enforces address-translation protection checks.",
    wrong: {
      1: "A memory scheduler is not the hardware address-translation component.",
      2: "Memory mapper is not the standard hardware unit name for virtual-to-physical translation.",
      3: "A memory controller manages physical memory access, such as DRAM transactions, but it is not the virtual memory translator.",
    },
  },
  "2025-q14": {
    correctIndex: 1,
    correct:
      "Dynamic relocation determines physical addresses while the program runs, typically by adding a base register to each logical address and checking a bounds or limit register.",
    wrong: {
      0: "Adjusting addresses at load time is static relocation, not dynamic relocation.",
      2: "A limit or bound register stores a legal range or size, not simply the ending address of a process.",
      3: "Fixed memory blocks describe fixed partitioning or paging-like allocation, not dynamic base-and-bounds relocation.",
    },
  },
  "2025-q15": {
    correctIndex: 0,
    correct:
      "Segmentation splits an address space into variable-sized logical units, such as code, heap, stack, or data, each of which can have separate base and bound information.",
    wrong: {
      1: "Fixed-size blocks are the idea behind paging, where pages and frames have uniform sizes.",
      2: "Segmentation does not allocate the entire process to one segment. A process can have several logical segments.",
      3: "Splitting memory into pages is paging, not segmentation.",
    },
  },
  "2025-q16": {
    correctIndex: 3,
    correct:
      "Best-Fit chooses the smallest free partition that is still large enough for the request, leaving larger holes available for larger future allocations.",
    wrong: {
      0: "Worst-Fit chooses the largest available hole, the opposite of the stated rule.",
      1: "Next-Fit continues searching from the previous allocation position and picks the next sufficiently large hole.",
      2: "First-Fit picks the first sufficiently large hole it encounters, not necessarily the smallest suitable one.",
    },
  },
  "2025-q17": {
    correctIndex: 1,
    correct:
      "Statements 1 and 4 are true: paging can waste unused bytes inside the last allocated page, and page tables store the information mapping virtual pages to physical frames.",
    wrong: {
      0: "Statement 1 is true, but statement 3 is false because pages and frames have the same size.",
      2: "Statement 2 is false because a virtual page maps to one physical frame at a time in the ordinary model, not multiple frames.",
      3: "Both selected statements are false: pages do not normally map to multiple frames, and pages and frames are equal-sized.",
    },
  },
  "2025-q18": {
    correctIndex: 0,
    correct:
      "Statements 1 and 3 are true. An inverted page table has one entry per physical frame, and each entry must identify the virtual page and process ID occupying that frame.",
    wrong: {
      1: "Statement 4 is false because inverted paging usually requires hashing or search and is not inherently faster than a conventional per-process page table.",
      2: "Statement 2 is not the basic/default property being tested. Page sharing is awkward in an inverted table and needs extra handling beyond the one-entry-per-frame idea.",
      3: "Statement 3 is true, but statement 2 is not the expected true statement, and the option omits statement 1.",
    },
  },
  "2025-q19": {
    correctIndex: 3,
    correct:
      "A paged virtual address is split into a page number, used to find the translation, and an offset, copied within the selected physical frame.",
    wrong: {
      0: "Frame number and offset describe the physical address after translation, not the virtual address before translation.",
      1: "Base and limit belong to relocation or segmentation-style protection, not the normal paging address split.",
      2: "Segment number and offset describe segmentation, where variable-sized segments are translated separately.",
    },
  },
  "2025-q20": {
    correctIndex: 1,
    correct:
      "A 16 KB page contains 16 * 1024 = 16384 bytes, which is 2^14 bytes. The offset therefore needs 14 low-order address bits.",
    wrong: {
      0: "12 offset bits would address only 4 KB within a page.",
      2: "15 offset bits would correspond to a 32 KB page.",
      3: "13 offset bits would correspond to an 8 KB page.",
    },
  },
  "2025-q21": {
    correctIndex: 2,
    correct:
      "With 39-bit virtual addresses and 4 KB pages, the offset is 12 bits. The page number therefore uses 39 - 12 = 27 bits.",
    wrong: {
      0: "12 is the offset width for a 4 KB page, not the page-number width.",
      1: "28 would require a different virtual address width or page size; it does not follow from 39 minus 12.",
      3: "24 would leave only 36 total virtual address bits when combined with the 12-bit offset.",
    },
  },
  "2025-q22": {
    correctIndex: 3,
    correct:
      "A TLB miss occurs when the needed virtual-to-physical page translation is not found in the TLB, forcing a page-table lookup before the access can complete.",
    wrong: {
      0: "Some CPUs use software refill handlers, but the TLB itself is a hardware cache of translations in the usual OS model.",
      1: "A TLB is small and holds selected translations, not the entire page table of one process.",
      2: "The TLB stores translations for pages, not the page contents themselves. The wording confuses cached mappings with cached memory data.",
    },
  },
  "2025-q23": {
    correctIndex: 2,
    correct:
      "Round-Robin is a CPU scheduling policy for sharing processor time among runnable tasks. It is not a memory page replacement policy.",
    wrong: {
      0: "FIFO can be used as a page replacement policy by evicting the oldest loaded page.",
      1: "Least-recently used is a classic replacement idea: evict the page that has not been used for the longest time.",
      3: "Random replacement is a real simple replacement policy that chooses a victim randomly.",
    },
  },
  "2025-q24": {
    correctIndex: 0,
    correct:
      "A 4 KB page can hold 4096 / 4 = 1024 page-table entries. Selecting one entry among 1024 alternatives requires log2(1024) = 10 index bits.",
    wrong: {
      1: "512 entries is the wrong count for 4-byte entries in a 4 KB page, and 512 entries would need 9 bits rather than 11.",
      2: "512 is not the entry count, and 8 bits can select only 256 entries.",
      3: "1024 is the right entry count, but 9 bits select only 512 entries, so the index width is wrong.",
    },
  },
  "2025-q25": {
    correctIndex: 2,
    correct:
      "The load, arithmetic, and store steps are not atomic. Serial execution can produce 1, while an interleaving where both processes load 1 before either store can lose one update and leave either 2 or 0.",
    wrong: {
      0: "-1 and 3 cannot result from one increment and one decrement starting at 1; each process computes only 0 or 2 before storing.",
      1: "This includes the impossible value -1. A race can lose an update, but it cannot apply the decrement twice.",
      3: "1 is possible, but it is not the only possible result because the two stores can race and overwrite one another.",
    },
    uncertainty:
      "generatedExamManifest.ts currently marks option index 1, but the source PDF and official solution identify option index 2, '0, 1, 2'.",
  },
  "2025-q26": {
    correctIndex: 0,
    correct:
      "A condition variable lets a thread sleep until another thread signals that a condition it is waiting for may now be true, usually while both coordinate with a mutex.",
    wrong: {
      1: "Limiting how many threads enter an area is a semaphore/counting mechanism use case, not the main role of a condition variable.",
      2: "Mutual exclusion is provided by locks or mutexes. A condition variable coordinates waiting and waking, not exclusive access by itself.",
      3: "Protecting shared data from corruption is done with mutual exclusion. Condition variables solve the wait-for-a-condition part.",
    },
  },
  "2025-q27": {
    correctIndex: 3,
    correct:
      "The Coffman deadlock conditions are mutual exclusion, hold and wait, no preemption, and circular wait. Deadlock requires all four to hold at the same time.",
    wrong: {
      0: "This includes preemption and resource sharing, but deadlock requires no preemption and non-shareable resources.",
      1: "This includes preemption and omits circular wait, so it is not the set of deadlock conditions.",
      2: "This includes no preemption, mutual exclusion, and hold and wait, but replaces circular wait with resource sharing.",
    },
  },
  "2025-q28": {
    correctIndex: 2,
    correct:
      "DMA lets a device controller transfer blocks directly between the device and main memory after the CPU sets up the operation, reducing CPU copying and polling overhead.",
    wrong: {
      0: "Constant polling wastes CPU cycles. DMA is used to reduce CPU involvement in the transfer.",
      1: "DMA-capable devices still need drivers to configure buffers, commands, and completion handling.",
      3: "DMA is intended to make large transfers more efficient, not to slow I/O for synchronization.",
    },
  },
  "2025-q29": {
    correctIndex: 2,
    correct:
      "In memory-mapped I/O, device registers are placed in the memory address space, so the CPU reads and writes them with ordinary load/store memory instructions.",
    wrong: {
      0: "Special I/O instructions to separate ports describe port-mapped I/O, not memory-mapped I/O.",
      1: "DMA can move data, but it is not the CPU's general mechanism for accessing memory-mapped device registers.",
      3: "Interrupts notify the CPU about device events; they are not the address-access mechanism.",
    },
  },
  "2025-q30": {
    correctIndex: 1,
    correct:
      "SSTF chooses the pending request closest to the current disk-head position, so it directly tries to minimize seek movement.",
    wrong: {
      0: "FIFO serves requests in arrival order without considering disk-head distance.",
      2: "Priority scheduling orders requests by priority, not by shortest seek distance.",
      3: "Round-Robin is a CPU scheduling/time-sharing idea, not a disk-arm movement optimization.",
    },
  },
  "2025-q31": {
    correctIndex: 3,
    correct:
      "An HDD stores bits magnetically on spinning platters, while an SSD stores data in non-volatile NAND flash memory.",
    wrong: {
      0: "Optical discs are media such as CDs or DVDs; they are not the primary storage medium of HDDs.",
      1: "This assigns optical discs to HDDs and magnetic platters to SSDs, both incorrectly.",
      2: "Magnetic platters are correct for HDDs, but volatile RAM is not the persistent storage medium used by SSDs.",
    },
  },
  "2025-q32": {
    correctIndex: 0,
    correct:
      "7200 RPM means one rotation takes 60000 / 7200 = 8.33 ms. The average rotational wait is half of that, 4.17 ms, and 9 ms seek time gives 13.17 ms total.",
    wrong: {
      1: "17.33 ms adds a full rotation to the seek time, but the average rotational latency is half a rotation.",
      2: "9 ms includes only the seek time and omits rotational latency.",
      3: "4.17 ms includes only average rotational latency and omits the 9 ms seek time.",
    },
  },
  "2025-q33": {
    correctIndex: 0,
    correct:
      "Path, inode, and file descriptor are distinct file references: a path names a file through directories, an inode identifies the file object and metadata, and a file descriptor is a per-process handle for an open file.",
    wrong: {
      1: "A file pointer is usually a C library stream or internal pointer, not one of the three standard OS-level references emphasized here.",
      2: "File name and path overlap as name-based references, so this option does not give three distinct levels.",
      3: "This omits the file descriptor, which is the per-process handle returned by open().",
    },
  },
  "2025-q34": {
    correctIndex: 0,
    correct:
      "A Unix-style inode does not store the filename. Directory entries map names to inode numbers, which is why multiple names can point to the same inode through hard links.",
    wrong: {
      1: "Timestamps are file metadata and are normally stored in or associated with the inode.",
      2: "File ownership is inode metadata.",
      3: "File size is fundamental inode metadata used to interpret the file's logical length.",
    },
  },
  "2025-q35": {
    correctIndex: 1,
    correct:
      "open() returns a file descriptor, a small integer indexing the process's open-file table. Later read(), write(), and close() calls use this descriptor.",
    wrong: {
      0: "A link is a directory entry naming an inode, not the integer returned by open().",
      2: "An inode is the file-system metadata object; user code does not receive it directly from open().",
      3: "A path is the string used to locate the file before opening. After open(), the process uses the descriptor.",
    },
  },
  "2025-q36": {
    correctIndex: 0,
    correct:
      "Unix returns the lowest unused file descriptor. Since 0, 1, and 2 are normally stdin, stdout, and stderr, returning 5 implies descriptors 3 and 4 were already open, so two prior non-standard opens existed.",
    wrong: {
      1: "5 is the descriptor number returned, not the count of previously opened files.",
      2: "4 would count descriptor values incorrectly. Returning 5 only proves descriptors 3 and 4 were occupied in addition to the standard descriptors.",
      3: "3 mixes in the standard descriptors or miscounts the occupied slots. The official interpretation counts the two prior descriptors 3 and 4.",
    },
  },
  "2025-q37": {
    correctIndex: 3,
    correct:
      "The superblock stores global file-system metadata such as layout, block counts, sizes, and state needed to mount and interpret the file system.",
    wrong: {
      0: "Directories list file names and map them to inodes; the superblock does not list every file.",
      1: "Mapping physical memory to disk is not a file-system superblock role.",
      2: "Permissions are per-file metadata, normally stored in inodes, not in the global superblock.",
    },
  },
  "2025-q38": {
    correctIndex: 3,
    correct:
      "The very simple file-system model tracks free disk blocks with a bitmap, where each bit records whether the corresponding block is free or allocated.",
    wrong: {
      0: "The inode table stores inode records for files, not the global free-block state.",
      1: "Some systems can use free lists, but the simple file-system model used in the course tracks free space with a bitmap.",
      2: "A dynamic memory allocator manages RAM, not persistent disk-block allocation in this file-system model.",
    },
  },
} as const satisfies Record<string, ChoiceGroupExplanation>;

export default explanations2025;
