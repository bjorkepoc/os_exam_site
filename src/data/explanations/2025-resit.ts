export type ChoiceOptionIndex = 0 | 1 | 2 | 3;

export interface ChoiceGroupExplanation {
  correctIndex: ChoiceOptionIndex;
  correct: string;
  wrong: Partial<Record<ChoiceOptionIndex, string>>;
  uncertainty?: string;
}

// Explanations are keyed by the choice group ids in generatedExamManifest.ts.
// The numeric keys in `wrong` are option indexes from the source PDF order.
export const explanations2025Resit = {
  "2025-resit-q01": {
    correctIndex: 3,
    correct:
      "A traditional Unix-like OS, and Linux in particular, uses a monolithic kernel architecture: process management, memory management, file systems, networking, and device drivers run largely in kernel space and call each other directly.",
    wrong: {
      0: "A layered kernel describes an implementation style where services are stacked in strict layers. That is not the kernel architecture normally meant by Unix-like OSs in this course question.",
      1: "A microkernel keeps only minimal mechanisms, such as scheduling and IPC, in the kernel and moves services such as file systems and drivers to user space. That is the opposite direction from the usual Unix/Linux monolithic design.",
      2: "A hybrid kernel mixes monolithic and microkernel ideas, often associated with systems such as Windows NT or macOS/XNU. It is not the answer the question expects for a Unix-like OS.",
    },
  },
  "2025-resit-q02": {
    correctIndex: 3,
    correct:
      "Unix-like systems rely on the hardware distinction between user mode and kernel mode. Ordinary applications execute in user mode, while privileged OS code runs in kernel mode so it can access protected instructions and hardware state.",
    wrong: {
      0: "Application mode is not the standard protected CPU mode name. Applications run in user mode; the privileged side is kernel mode.",
      1: "This uses two nonstandard labels. The important protection boundary is user mode versus kernel mode, not application mode versus system mode.",
      2: "System mode is an imprecise label here. The conventional OS term for privileged execution is kernel mode.",
    },
  },
  "2025-resit-q03": {
    correctIndex: 2,
    correct:
      "A process is a running instance of a program, with execution state such as registers, program counter, address space, open files, and scheduling state managed by the OS.",
    wrong: {
      0: "A system call is a controlled entry from user mode into the kernel. A process may make system calls, but it is not itself a system call.",
      1: "A program stored on disk is a passive executable file. It becomes a process only after the OS loads it and schedules it for execution.",
      3: "A process owns memory, but it is more than a block of memory: it also has CPU context, OS metadata, file descriptors, and a lifecycle state.",
    },
  },
  "2025-resit-q04": {
    correctIndex: 3,
    correct:
      "When a running process issues an I/O request that cannot complete immediately, it cannot keep using the CPU. The OS blocks it and schedules another ready process until the device later signals completion.",
    wrong: {
      0: "Running to ready happens when the scheduler preempts a runnable process, for example when its time slice expires. An I/O request waits for an external event, so the process is blocked instead.",
      1: "Ready to running is dispatch: the scheduler chooses a ready process and gives it the CPU. That is not caused by issuing I/O.",
      2: "Blocked to ready happens when the I/O finishes or another waited-for event occurs. The question asks what happens when the request is issued.",
    },
  },
  "2025-resit-q05": {
    correctIndex: 3,
    correct:
      "Windows creates a new process with the CreateProcess API. Unlike Unix, it does not use a fork-then-exec model as the main process creation interface.",
    wrong: {
      0: "exec() is the Unix-style operation that replaces the current process image with a new program. It does not create a separate new process by itself.",
      1: "fork() is the Unix system call that creates a child process by duplicating the calling process. The question asks for the Windows process creation call.",
      2: "pthread_create() creates a thread inside an existing process, not a new process with a separate process object and address space.",
    },
  },
  "2025-resit-q06": {
    correctIndex: 0,
    correct:
      "wait() lets a parent process suspend until one of its children terminates, then collect the child's exit status and allow the OS to release the child's remaining process table state.",
    wrong: {
      1: "wait() does not wait for a child to be created. Creation happens through fork() in Unix-like systems; wait() is used after creation to synchronize with termination.",
      2: "Replacing the current process image is exec(), not wait().",
      3: "Creating a new process with a program is a process creation operation, such as fork() plus exec() in Unix or CreateProcess on Windows, not wait().",
    },
  },
  "2025-resit-q07": {
    correctIndex: 1,
    correct:
      "A process is the OS abstraction for a running program and owns resources such as an address space. A thread is an execution stream within that process, sharing the process resources while having its own stack and register context.",
    wrong: {
      0: "Processes are normally isolated from each other and do not automatically share an address space. Threads of the same process are the ones that share code, globals, and heap.",
      2: "Both processes and kernel-supported threads are managed by the OS scheduler. The CPU executes whatever context the scheduler dispatches; this option invents the wrong management split.",
      3: "A thread does not have its own full address space. Threads in the same process share one address space; processes have separate address spaces.",
    },
  },
  "2025-resit-q08": {
    correctIndex: 3,
    correct:
      "Threads in the same process normally share code, global variables, and heap, but each thread needs its own stack for function calls, local variables, return addresses, and saved registers.",
    wrong: {
      0: "Global variables live in the process address space, so all threads in that process can access the same global data unless synchronization prevents races.",
      1: "The program code segment is shared by threads of the same process. Multiple threads execute the same code with different instruction pointers.",
      2: "The heap belongs to the process address space, so threads share dynamically allocated objects. That is why heap access often needs locks.",
    },
  },
  "2025-resit-q09": {
    correctIndex: 1,
    correct:
      "If job lengths are known and the scheduler is non-preemptive, Shortest Job First minimizes average waiting time by running the shortest CPU burst before longer ones.",
    wrong: {
      0: "STCF, or shortest time-to-completion first, is the preemptive version that can interrupt a running job when a shorter remaining job arrives. The question asks for a non-preemptive algorithm.",
      2: "FIFO can make short jobs wait behind long jobs, producing the convoy effect and a worse average waiting time than SJF when runtimes are known.",
      3: "Round-Robin is preemptive and designed for responsiveness/fairness through time slicing, not for the non-preemptive average-waiting-time optimum with known job lengths.",
    },
  },
  "2025-resit-q10": {
    correctIndex: 2,
    correct:
      "Round-Robin gives each runnable process a time slice, so interactive jobs get repeated chances to run instead of being stuck behind long CPU-bound jobs. That improves response time in mixed workloads.",
    wrong: {
      0: "STCF depends on knowing or estimating remaining CPU time and can be impractical for an unknown mix of CPU-bound and interactive applications.",
      1: "Priority scheduling can improve response time only if priorities are chosen well, and low-priority jobs may starve. The basic fair time-slicing answer here is RR.",
      3: "SJF is non-preemptive and can make newly interactive or short tasks wait behind a long running job, which hurts response time.",
    },
  },
  "2025-resit-q11": {
    correctIndex: 0,
    correct:
      "MLFQ uses multiple priority queues, so priority level decides which queue runs first, and each queue commonly uses Round-Robin among jobs at the same priority.",
    wrong: {
      1: "SJF is not the main mechanism in MLFQ. MLFQ approximates interactivity by changing priorities based on behavior rather than by requiring known shortest jobs.",
      2: "FIFO and RR alone do not capture the central MLFQ idea: processes move among priority queues based on CPU usage and yielding behavior.",
      3: "SJF and FIFO omit Round-Robin time slicing and priority levels, which are the two key scheduling ideas combined by MLFQ.",
    },
  },
  "2025-resit-q12": {
    correctIndex: 0,
    correct:
      "In MLFQ, using an entire time quantum is evidence of CPU-bound behavior. The scheduler lowers such a process to a lower-priority queue so interactive jobs that yield quickly stay responsive.",
    wrong: {
      1: "A process that completes is removed from scheduling; it is not demoted to another queue.",
      2: "Using less CPU than expected usually means the process yielded, often for I/O, so MLFQ tends to keep or boost its priority rather than lower it.",
      3: "Requesting I/O before the quantum ends is typical interactive behavior. MLFQ normally rewards that behavior instead of demoting it.",
    },
  },
  "2025-resit-q13": {
    correctIndex: 0,
    correct:
      "A virtual address is generated by the CPU while executing a process. The MMU translates it through relocation, segmentation, or paging structures into a physical memory address.",
    wrong: {
      1: "Disk addresses identify storage locations, not addresses in a process virtual address space.",
      2: "The actual physical location in RAM is the result of address translation, not the virtual address itself.",
      3: "I/O devices may be memory-mapped on some systems, but virtual addresses are not exclusively for I/O devices.",
    },
  },
  "2025-resit-q14": {
    correctIndex: 3,
    correct:
      "The question asks for the false statement. Dynamic relocation with base and bound/limit registers supports variable-size contiguous allocations; it does not divide memory into fixed-size blocks.",
    wrong: {
      0: "This is true, so it is not the false statement. Dynamic relocation computes the physical address during execution by adding a base value after checking bounds.",
      1: "This is true for dynamic relocation in contiguous allocation: each process can be placed in a variable-size region matching its memory needs.",
      2: "This is true. The bound or limit register records the valid range for the process so the hardware can detect addresses outside the allocated region.",
    },
  },
  "2025-resit-q15": {
    correctIndex: 2,
    correct:
      "The question asks for the false statement. Segmentation uses variable-size logical segments, so free memory can be split into holes between allocated segments; external fragmentation is still possible.",
    wrong: {
      0: "This is true. Segmentation matches program structure by separating logical regions such as code, data, heap, and stack.",
      1: "This is true. Each segment is described by a base and a limit so the hardware can translate offsets and enforce bounds.",
      3: "This is true in the intended model: independently described segments can grow or shrink separately, subject to available memory and relocation constraints.",
    },
  },
  "2025-resit-q16": {
    correctIndex: 2,
    correct:
      "Worst-Fit chooses the largest available hole for the allocation, leaving the biggest remaining fragment after placing the segment.",
    wrong: {
      0: "Best-Fit chooses the smallest hole that is large enough, trying to leave larger holes available for future requests.",
      1: "Next-Fit is a variant of First-Fit that resumes its search from where the previous allocation ended, not from the largest hole.",
      3: "First-Fit chooses the first sufficiently large hole it encounters during the search, regardless of whether larger holes exist later.",
    },
  },
  "2025-resit-q17": {
    correctIndex: 1,
    correct:
      "Statement 1 is true because fixed-size pages can waste space in the last page of an allocation, causing internal fragmentation. Statement 4 is true because page tables store the virtual-page to physical-frame translation information.",
    wrong: {
      0: "Statement 2 is false: one virtual page maps to one physical frame at a time in ordinary paging. Combining it with true statement 4 makes this option wrong.",
      2: "Statement 3 is false because pages and frames must be the same size for simple page offset translation. Statement 1 alone is true, but 1,3 is not.",
      3: "Both listed statements are false: pages do not map to multiple frames, and page/frame sizes are matched within the paging system.",
    },
  },
  "2025-resit-q18": {
    correctIndex: 2,
    correct:
      "Inverted paging keeps one entry per physical frame instead of one page table per process, reducing table size. It also makes sharing harder because the table is organized by frames and must identify which process and virtual page occupy each frame.",
    wrong: {
      0: "Statement 2 is true, but statement 4 is false. Inverted page tables usually need hashing or search to find a virtual page, so they are not inherently faster than traditional per-process tables.",
      1: "Statement 2 is true, but statement 3 is false. An inverted page table entry stores information such as process id and virtual page number for a frame, not the offset; the offset is copied directly from the virtual address.",
      3: "Statement 1 is true, but statement 3 is false because offsets are not stored as translation entries in the inverted page table.",
    },
  },
  "2025-resit-q19": {
    correctIndex: 0,
    correct:
      "The question asks which statement about traditional paging is false. In a conventional paging system, page size is a system/architecture property and frames are the same size, not arbitrary per process.",
    wrong: {
      1: "This is true. For a fixed virtual address space, smaller pages mean more virtual pages and therefore a larger page table; larger pages mean fewer entries.",
      2: "This is true. A traditional page table maps virtual page numbers to physical frame numbers, plus protection and status bits.",
      3: "This is true. Paging can waste unused bytes inside the last page of a region, which is internal fragmentation.",
    },
  },
  "2025-resit-q20": {
    correctIndex: 2,
    correct:
      "The offset selects a byte within a page. A 32KB page is 32 * 1024 bytes = 2^15 bytes, so 15 low-order address bits are used as the offset.",
    wrong: {
      0: "12 bits would address 2^12 bytes, which is 4KB, not 32KB.",
      1: "13 bits would address 8KB pages, not 32KB pages.",
      3: "14 bits would address 16KB pages, one power of two too small.",
    },
  },
  "2025-resit-q21": {
    correctIndex: 2,
    correct:
      "With 48-bit virtual addresses and 4KB pages, the offset uses 12 bits because 4KB = 2^12. The remaining 48 - 12 = 36 bits identify the virtual page number.",
    wrong: {
      0: "27 bits would leave 21 bits for the offset, implying a 2MB page, not the stated 4KB page.",
      1: "28 bits does not match the split of a 48-bit virtual address with a 12-bit page offset.",
      3: "39 bits would leave only 9 offset bits, corresponding to 512-byte pages rather than 4KB pages.",
    },
  },
  "2025-resit-q22": {
    correctIndex: 2,
    correct:
      "A TLB is a small associative cache of recent page table entries. It keeps virtual-page to physical-frame translations close to the CPU so most address translations avoid another page table memory access.",
    wrong: {
      0: "A TLB cannot store only physical addresses; it must also match the virtual page number, and often address-space or permission metadata, to know which translation applies.",
      1: "The whole page table is far too large for a TLB. The TLB stores a small subset of recently or frequently used entries.",
      3: "This confuses a TLB with a data cache. The TLB stores translations, not the contents of virtual memory pages.",
    },
  },
  "2025-resit-q23": {
    correctIndex: 2,
    correct:
      "Optimal replacement evicts the entry whose next use is farthest in the future, which cannot be known exactly. LRU approximates that by evicting the entry least recently used, assuming past recency predicts near-future use.",
    wrong: {
      0: "Round-Robin cycles through candidates without using recency or future-use information, so it does not mimic optimal replacement.",
      1: "Random replacement ignores all usage history. It can be simple, but it is not an approximation of optimal replacement.",
      3: "FIFO evicts the oldest loaded entry even if it is heavily used. That can be much worse than optimal and does not track recency.",
    },
  },
  "2025-resit-q24": {
    correctIndex: 2,
    correct:
      "The solution key marks this option. The 9-bit directory-level part follows from 512 entries per page, since log2(512) = 9.",
    wrong: {
      0: "10 bits would require 2^10 = 1024 entries per directory level, which does not follow from 8-byte entries in a 4KB page.",
      1: "The 512-entry count follows from 4KB / 8 bytes, but 10 bits would index 1024 entries rather than 512.",
      3: "This is the standard arithmetic from the question text: 4KB / 8 bytes = 512 entries and log2(512) = 9 bits. It does not match the official key, which is why this item is flagged as uncertain.",
    },
    uncertainty:
      "The PDF says each page table entry is 8 bytes and each page is 4KB. That gives 4096 / 8 = 512 entries, so the technically consistent answer is 512, 9 bits. The official key and manifest mark 1024, 9 bits.",
  },
  "2025-resit-q25": {
    correctIndex: 3,
    correct:
      "The classic critical-section requirements are mutual exclusion, progress, and bounded waiting. Preemption is a scheduling mechanism, not a required correctness condition for a critical-section solution.",
    wrong: {
      0: "Progress is required: if no process is in the critical section, the decision about who enters next should not be postponed indefinitely.",
      1: "Mutual exclusion is required: at most one thread or process may execute the critical section at a time.",
      2: "Bounded waiting is required: a thread that wants to enter must not be bypassed forever by other contenders.",
    },
  },
  "2025-resit-q26": {
    correctIndex: 0,
    correct:
      "The question asks for the false statement. A condition variable is a synchronization object used to sleep and wake threads around a predicate; it does not store the shared data protected by the mutex.",
    wrong: {
      1: "This is true in normal correct usage. A condition variable is paired with a mutex so the condition predicate can be checked and changed without races.",
      2: "This is true. A condition-variable wait releases the mutex while sleeping and reacquires it before returning, so the thread can re-check the predicate safely.",
      3: "This is true. Condition variables are used to block until a program condition, such as buffer not empty, may have become true.",
    },
  },
  "2025-resit-q27": {
    correctIndex: 2,
    correct:
      "Under the common counting-semaphore convention, a negative semaphore value records how many threads are blocked. A current value of -1 therefore means one waiting thread.",
    wrong: {
      0: "Three waiting threads would correspond to a value of -3 in this convention, not -1.",
      1: "Two waiting threads would correspond to -2, not -1.",
      3: "A value of -1 means one thread has attempted to wait when no resource was available; zero waiting threads would not be represented by a negative value.",
    },
  },
  "2025-resit-q28": {
    correctIndex: 0,
    correct:
      "DMA lets an I/O controller transfer blocks directly between the device and main memory after the CPU sets up the operation. The CPU avoids copying every byte itself and can run other work meanwhile.",
    wrong: {
      1: "DMA still requires drivers and OS setup to program the device/controller, pin or prepare buffers, and handle completion.",
      2: "Polling constantly is the opposite of DMA's CPU-saving goal. DMA reduces CPU involvement during the bulk transfer.",
      3: "DMA is usually used to improve throughput and reduce CPU overhead, not deliberately slow I/O for synchronization.",
    },
  },
  "2025-resit-q29": {
    correctIndex: 1,
    correct:
      "With interrupt-driven I/O, the device raises an interrupt when it needs attention or completes a request. The OS interrupt handler runs, records completion, and can wake a process that was blocked for that I/O.",
    wrong: {
      0: "This describes polling, where the CPU repeatedly checks a status register. Interrupts avoid that busy waiting.",
      2: "The OS cannot ignore I/O until all processes finish; I/O completion changes process states and affects scheduling.",
      3: "The CPU does not directly control devices without signaling. Device controllers expose registers and notify the CPU through interrupts or are polled by the OS.",
    },
  },
  "2025-resit-q30": {
    correctIndex: 2,
    correct:
      "SSTF chooses the pending disk request closest to the current head position, reordering the queue to reduce seek distance and average seek time.",
    wrong: {
      0: "Priority scheduling is a CPU scheduling idea unless priorities are specifically attached to I/O requests; it is not the named disk-head-distance algorithm.",
      1: "Round-Robin time-slices CPU access among runnable tasks. It does not order disk requests by seek distance.",
      3: "FIFO serves disk requests in arrival order. It is simple, but it does not reorder requests to reduce head movement.",
    },
  },
  "2025-resit-q31": {
    correctIndex: 2,
    correct:
      "SSDs use flash memory and have no mechanical seek or rotational delay, so random and many sequential reads/writes are typically faster than on HDDs.",
    wrong: {
      0: "HDDs usually have the lower cost per gigabyte. SSDs trade higher price for speed, lower latency, and shock resistance.",
      1: "SSDs are mechanically durable because they have no moving parts. This option says the durability is due to moving parts, which describes a liability of HDDs, not an SSD advantage.",
      3: "HDD product lines often provide very large maximum capacities. Larger maximum capacity is not the basic SSD advantage tested here.",
    },
  },
  "2025-resit-q32": {
    correctIndex: 0,
    correct:
      "The solution key marks 12 ms, but the standard formula from the stated data does not produce it. With 15000 RPM, one rotation takes 4 ms and average rotational latency is 2 ms; adding 9 ms seek gives 11 ms.",
    wrong: {
      1: "14 ms would require adding extra time not stated in the problem; transfer time is explicitly negligible.",
      2: "13 ms is what you get by incorrectly adding a full 4 ms rotation to the 9 ms seek. Average rotational latency uses half a rotation, not a full rotation.",
      3: "11 ms is the standard calculation from the prompt: 9 ms seek + 2 ms average rotational latency + 0 ms transfer. It does not match the official key, so this item is flagged as uncertain.",
    },
    uncertainty:
      "The official key and manifest mark 12, but the prompt states 15000 RPM, 9 ms average seek, and 0 ms transfer. Standard average latency is 9 + (60000 / 15000) / 2 = 11 ms.",
  },
  "2025-resit-q33": {
    correctIndex: 3,
    correct:
      "The superblock stores file-system-wide metadata such as layout, size, block counts, free-space information location, and other status needed to mount and manage the file system.",
    wrong: {
      0: "A data block stores file or directory contents, not the global description of the file system.",
      1: "A boot block may contain bootstrapping code or be reserved for boot use. It is not the main file-system metadata structure.",
      2: "The inode table stores metadata for individual files. The question asks what stores information about the file system as a whole.",
    },
  },
  "2025-resit-q34": {
    correctIndex: 0,
    correct:
      "The question asks what is not stored in an inode. File names live in directory entries that map names to inode numbers; the inode stores metadata about the file object itself.",
    wrong: {
      1: "Timestamps are inode metadata, such as modification time and sometimes creation/change/access times depending on the file system.",
      2: "Ownership information, such as user id and group id, is stored in the inode so permissions can be enforced independent of the filename.",
      3: "File size is a core inode field because the file system needs it to know the logical length of the file.",
    },
  },
  "2025-resit-q35": {
    correctIndex: 3,
    correct:
      "A file descriptor is a small per-process integer handle returned by calls such as open(). The process uses it in later read(), write(), close(), or similar calls to refer to the open file description or I/O object.",
    wrong: {
      0: "A unique on-disk identifier is closer to an inode number. A file descriptor is only meaningful inside a process's descriptor table.",
      1: "A human-readable name is a filename. The descriptor is numeric and refers to an already opened object.",
      2: "A descriptor is not a data structure containing all file contents. It is an index/handle to kernel-maintained open-file state.",
    },
  },
  "2025-resit-q36": {
    correctIndex: 1,
    correct:
      "In Unix-like systems, descriptors 0, 1, and 2 are normally already occupied by standard input, standard output, and standard error. If open() returns 3, this is the first new file opened by this process in the question's sense, so zero earlier explicit opens.",
    wrong: {
      0: "One previous explicit open would normally have consumed descriptor 3 already, making the next returned descriptor 4.",
      2: "The returned value 3 is the descriptor number, not the count of files previously opened by the process.",
      3: "Two previous explicit opens would usually take descriptors 3 and 4, so the next open would return 5.",
    },
  },
  "2025-resit-q37": {
    correctIndex: 1,
    correct:
      "A file-system bitmap uses bits to record whether blocks, and sometimes inodes in a separate bitmap, are free or allocated. This lets the allocator find space and avoid reusing live blocks.",
    wrong: {
      0: "Mapping filenames to file objects is the role of directories, usually through name-to-inode mappings, not the free-space bitmap.",
      2: "Metadata such as permissions and timestamps is stored in inodes, not in the block-allocation bitmap.",
      3: "This is too broad and inaccurate. The bitmap manages allocation status for blocks; it is not the structure that manages all file contents, names, and metadata.",
    },
  },
  "2025-resit-q38": {
    correctIndex: 0,
    correct:
      "To resolve /usr/test.txt in the simple file-system model, the OS first reads the usr inode block to locate usr's directory data, then reads the usr data block to find the test.txt entry, then reads the test.txt inode block, and finally accesses the test.txt data block.",
    wrong: {
      1: "This starts with the test.txt inode before reading the usr directory. The OS cannot know the test.txt inode number until it has searched the usr directory data.",
      2: "This reads the test.txt inode before reading the usr directory data. Directory data is what maps the name test.txt to its inode.",
      3: "This starts with the usr data block before consulting the usr inode block that tells the OS where that directory data is stored.",
    },
  },
} satisfies Record<string, ChoiceGroupExplanation>;

export default explanations2025Resit;
