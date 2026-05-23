export interface ChoiceOptionExplanation {
  text: string;
  isCorrect: boolean;
  explanation: string;
}

export interface ChoiceGroupExplanation {
  question: string;
  correctIndex: number;
  correctAnswer: string;
  options: ChoiceOptionExplanation[];
}

export type ChoiceExplanationMap = Record<string, ChoiceGroupExplanation>;

export const explanations2024Resit = {
  "2024-resit-q01": {
    question: "Which of the following is CORRECT?",
    correctIndex: 1,
    correctAnswer: "Monolithic kernel OSs have all system services and functionalities in kernel space.",
    options: [
      {
        text: "Microkernel OSs have all system services and functionalities in user space.",
        isCorrect: false,
        explanation:
          "Microkernels deliberately move many services, such as file systems and device drivers, out of the kernel, but not every OS function is in user space. A microkernel still keeps the small trusted core for low-level mechanisms such as scheduling, address-space management, traps, and IPC.",
      },
      {
        text: "Monolithic kernel OSs have all system services and functionalities in kernel space.",
        isCorrect: true,
        explanation:
          "In the course-level contrast, a monolithic kernel places core OS services such as process management, memory management, file systems, networking, and device drivers inside one kernel address space. That is why faults in kernel services can affect the whole OS, but calls between services can be fast.",
      },
      {
        text: "Linux uses a hybrid kernel architecture.",
        isCorrect: false,
        explanation:
          "Linux is normally classified as a monolithic kernel, even though it supports loadable kernel modules. Loadable modules do not make it a hybrid kernel because they still execute in kernel mode as part of the kernel.",
      },
      {
        text: "Windows and MacOS both use monolithic kernel architectures.",
        isCorrect: false,
        explanation:
          "Windows NT and modern macOS are usually described as hybrid designs. They include monolithic-style kernel components, but their architecture is not the plain monolithic model used as the correct contrast here.",
      },
    ],
  },

  "2024-resit-q02": {
    question: "In Unix-like OSs, which system call creates a new process?",
    correctIndex: 0,
    correctAnswer: "fork()",
    options: [
      {
        text: "fork()",
        isCorrect: true,
        explanation:
          "On Unix-like systems, fork() creates a new child process by duplicating the calling process. The child receives its own process ID and usually continues from the same program point, with copy-on-write used by modern kernels to avoid immediately copying all memory.",
      },
      {
        text: "new()",
        isCorrect: false,
        explanation:
          "new is a language-level allocation operation in languages such as C++ and Java. It creates an object or allocates memory inside an existing process; it is not an OS system call that creates a process.",
      },
      {
        text: "pthread_create()",
        isCorrect: false,
        explanation:
          "pthread_create() creates a new POSIX thread inside the current process. Threads share the same address space and many process resources, so this is not the same operation as creating a separate process.",
      },
      {
        text: "createprocess()",
        isCorrect: false,
        explanation:
          "CreateProcess is the Windows API for starting a process, not the Unix-like system call asked for here. The Unix process-creation primitive taught in this context is fork().",
      },
    ],
  },

  "2024-resit-q03": {
    question: "Which of the following is CORRECT for process?",
    correctIndex: 0,
    correctAnswer:
      "The program counter of a process is used to indicate the next instruction to be executed by the process.",
    options: [
      {
        text: "The program counter of a process is used to indicate the next instruction to be executed by the process.",
        isCorrect: true,
        explanation:
          "The program counter is part of the saved CPU context for a process or thread. When the OS stops and later resumes execution, the PC tells the CPU which instruction address should be fetched next.",
      },
      {
        text: "The stack and heap of a process utilize the same memory allocation mechanism.",
        isCorrect: false,
        explanation:
          "The stack is managed mostly by call and return discipline, grows and shrinks with stack frames, and is usually automatically adjusted by the compiler and CPU conventions. The heap is managed by dynamic allocators such as malloc/free or new/delete, so the mechanisms and lifetimes are different.",
      },
      {
        text: "The code section of a process can be modified during execution at runtime.",
        isCorrect: false,
        explanation:
          "In the normal process memory layout, the code/text section contains executable instructions and is mapped read-only. Self-modifying code or JIT runtimes require special writable/executable mappings, so the statement is not correct as a general process property.",
      },
      {
        text: "A process can only be in three states in all OSs, i.e., ready, running, and blocked.",
        isCorrect: false,
        explanation:
          "Ready, running, and blocked are the basic states, but real OSs commonly add states such as new, terminated, suspended-ready, or suspended-blocked. The word 'only' makes the statement false.",
      },
    ],
  },

  "2024-resit-q04": {
    question:
      "Assume that two threads, T1 and T2, are created within one process, which of the following is NOT CORRECT?",
    correctIndex: 1,
    correctAnswer: "T1 and T2 share the stack.",
    options: [
      {
        text: "T1 and T2 share the open files.",
        isCorrect: false,
        explanation:
          "Threads in the same process share process-level resources such as the open-file table. Because this statement is true, it is not the answer to a NOT CORRECT question.",
      },
      {
        text: "T1 and T2 share the stack.",
        isCorrect: true,
        explanation:
          "Each thread needs its own stack so its function calls, local variables, return addresses, and saved context do not overwrite another thread's call chain. The threads share the address space, but they do not share one execution stack.",
      },
      {
        text: "T1 and T2 share the code section.",
        isCorrect: false,
        explanation:
          "Threads created within one process execute in the same address space, so they can run the same program code. This statement is true, so it is not the false statement being asked for.",
      },
      {
        text: "T1 and T2 have their own registers.",
        isCorrect: false,
        explanation:
          "Each thread has its own CPU context, including registers and program counter, so the scheduler can pause and resume each thread independently. This statement is true.",
      },
    ],
  },

  "2024-resit-q05": {
    question: "Which of the following scheduling algorithm is non-preemptive?",
    correctIndex: 1,
    correctAnswer: "First come first serve (FCFS)",
    options: [
      {
        text: "Shortest time-to-completion first (STCF)",
        isCorrect: false,
        explanation:
          "STCF is the preemptive version of shortest-job scheduling. If a newly arrived job has less remaining time than the currently running job, STCF can preempt the current job.",
      },
      {
        text: "First come first serve (FCFS)",
        isCorrect: true,
        explanation:
          "FCFS runs jobs in arrival order and normally lets the selected job run until it blocks or finishes. It does not preempt a running job just because another job arrives.",
      },
      {
        text: "Multi-level feedback queue (MLFQ)",
        isCorrect: false,
        explanation:
          "MLFQ is typically preemptive: jobs run with time quanta, can be moved between queues, and higher-priority work can preempt lower-priority work.",
      },
      {
        text: "Round robin (RR)",
        isCorrect: false,
        explanation:
          "Round robin is explicitly preemptive because the timer interrupt stops a running job when its time slice expires and the scheduler rotates to another ready job.",
      },
    ],
  },

  "2024-resit-q06": {
    question: "Which of the following statement is TRUE for Shortest Job First (SJF)?",
    correctIndex: 0,
    correctAnswer: "2, 3",
    options: [
      {
        text: "2, 3",
        isCorrect: true,
        explanation:
          "Classical SJF is non-preemptive: once the shortest available job is chosen, it runs until completion or blocking. With known execution times, choosing the shortest job first minimizes average waiting time for that fixed set of jobs.",
      },
      {
        text: "1, 2",
        isCorrect: false,
        explanation:
          "Statement 2 is true, but statement 1 is false. SJF can starve long jobs if short jobs keep arriving, so it is not starvation-free.",
      },
      {
        text: "1, 2, 3",
        isCorrect: false,
        explanation:
          "Statements 2 and 3 are true, but including statement 1 makes this option wrong. SJF optimizes average waiting time under known burst times, but it can still starve long jobs.",
      },
      {
        text: "1, 3",
        isCorrect: false,
        explanation:
          "Statement 3 is true, but statement 1 is false and statement 2 is missing. The non-preemptive property is part of the definition of SJF in this question.",
      },
    ],
  },

  "2024-resit-q07": {
    question: "Which of the following statements is TRUE regarding memory management in OSs?",
    correctIndex: 2,
    correctAnswer: "1, 2, 3",
    options: [
      {
        text: "1, 2",
        isCorrect: false,
        explanation:
          "Statements 1 and 2 are true, but the option wrongly omits statement 3. Segmentation really does split an address space into logical regions such as code, stack, and heap that can be placed independently.",
      },
      {
        text: "2, 3",
        isCorrect: false,
        explanation:
          "Statements 2 and 3 are true, but statement 1 is also true. Fixed partitions can leave unused space inside an allocated partition when the process is smaller than the partition, which is internal fragmentation.",
      },
      {
        text: "1, 2, 3",
        isCorrect: true,
        explanation:
          "All three statements are true. Fixed partitions can cause internal fragmentation, compaction can reduce external fragmentation by moving allocated regions together, and segmentation represents logical variable-sized regions that can be allocated separately.",
      },
      {
        text: "1, 3",
        isCorrect: false,
        explanation:
          "Statements 1 and 3 are true, but statement 2 is also true. Compaction is the classic technique for handling external fragmentation when relocation is possible.",
      },
    ],
  },

  "2024-resit-q08": {
    question:
      "Assume dynamic relocation with base register 0x0A10 and bound register 500. What is the physical address of virtual address 0x0230?",
    correctIndex: 0,
    correctAnswer: "Segmentation fault",
    options: [
      {
        text: "Segmentation fault",
        isCorrect: true,
        explanation:
          "The bound is 500 decimal, which is 0x1F4. The virtual address 0x0230 is 560 decimal, so it is outside the legal offset range before translation. Even though base plus offset would be 0x0C40, the bounds check fails and the OS should trap.",
      },
      {
        text: "0x0570",
        isCorrect: false,
        explanation:
          "This is not the result of adding base 0x0A10 and offset 0x0230. More importantly, no physical address should be produced because the offset exceeds the bound.",
      },
      {
        text: "0x0C3A",
        isCorrect: false,
        explanation:
          "0x0C3A is not the base-plus-offset calculation. The raw sum would be 0x0C40, but the legal-address check happens first and rejects the virtual address.",
      },
      {
        text: "0x0C40",
        isCorrect: false,
        explanation:
          "0x0C40 is the arithmetic sum 0x0A10 + 0x0230, but dynamic relocation also checks that the virtual offset is less than the bound. Since 0x0230 is greater than 500 decimal, the access faults instead of translating.",
      },
    ],
  },

  "2024-resit-q09": {
    question:
      "Which of the following is NOT a memory allocation algorithm used to allocate a contiguous memory partition for a process?",
    correctIndex: 3,
    correctAnswer: "Least-recently-used",
    options: [
      {
        text: "First-fit",
        isCorrect: false,
        explanation:
          "First-fit is a contiguous allocation placement policy. It scans free holes and chooses the first hole large enough for the requested process partition.",
      },
      {
        text: "Best-fit",
        isCorrect: false,
        explanation:
          "Best-fit is also a contiguous memory allocation policy. It chooses the smallest free hole that can satisfy the request, trying to leave larger holes for later requests.",
      },
      {
        text: "Worst-fit",
        isCorrect: false,
        explanation:
          "Worst-fit is another contiguous allocation policy. It chooses the largest available hole, hoping the leftover space remains useful.",
      },
      {
        text: "Least-recently-used",
        isCorrect: true,
        explanation:
          "Least-recently-used is a replacement policy, most commonly for pages or cache entries. It decides what to evict, not where to place a process in a contiguous memory partition.",
      },
    ],
  },

  "2024-resit-q10": {
    question:
      "In an OS that uses paging to manage its virtual memory, which part of the virtual address is used to index the page?",
    correctIndex: 1,
    correctAnswer: "page number",
    options: [
      {
        text: "page offset",
        isCorrect: false,
        explanation:
          "The page offset selects the byte or word inside the page after the page has been identified. It is carried through translation unchanged; it does not choose the page-table entry.",
      },
      {
        text: "page number",
        isCorrect: true,
        explanation:
          "The virtual page number indexes the page table, or the relevant levels of a multi-level page table. The selected page-table entry then gives the physical frame number and protection bits.",
      },
      {
        text: "frame offset",
        isCorrect: false,
        explanation:
          "There is not a separate frame offset field used to index a virtual page. The same low-order offset bits are used within both the virtual page and the physical frame.",
      },
      {
        text: "frame number",
        isCorrect: false,
        explanation:
          "The frame number is the physical result stored in the page-table entry. It is not part of the virtual address field used to look up the page.",
      },
    ],
  },

  "2024-resit-q11": {
    question:
      "If the size of virtual address is m bits and the page size is 2^n bytes, how many bits are needed for the page number and page offset, respectively?",
    correctIndex: 1,
    correctAnswer: "m-n, n",
    options: [
      {
        text: "n, m",
        isCorrect: false,
        explanation:
          "A page size of 2^n bytes needs n offset bits, not n page-number bits. The page number uses the remaining high-order bits of the m-bit virtual address.",
      },
      {
        text: "m-n, n",
        isCorrect: true,
        explanation:
          "The offset must identify one byte inside a page of 2^n bytes, so it needs n bits. The whole virtual address has m bits, leaving m-n high-order bits for the virtual page number.",
      },
      {
        text: "m-n, m",
        isCorrect: false,
        explanation:
          "m-n is the correct page-number width, but the offset cannot require all m bits. If the offset used m bits, there would be no page-number field left.",
      },
      {
        text: "m, n",
        isCorrect: false,
        explanation:
          "n is the correct offset width, but the page number is not all m bits. The offset consumes n low-order bits, so only m-n bits remain for the page number.",
      },
    ],
  },

  "2024-resit-q12": {
    question: "Which of the following statements are TRUE for paging?",
    correctIndex: 0,
    correctAnswer: "1, 3",
    options: [
      {
        text: "1, 3",
        isCorrect: true,
        explanation:
          "A TLB caches recent virtual-page to physical-frame translations and can avoid extra page-table memory accesses. Multi-level paging can reduce memory used for page tables because lower-level tables are allocated only for populated portions of the virtual address space.",
      },
      {
        text: "1, 2, 3",
        isCorrect: false,
        explanation:
          "Statements 1 and 3 are true, but statement 2 is false. Paging uses fixed-size pages and frames, so it avoids external fragmentation; the typical fragmentation cost is internal fragmentation in the last page of an allocation.",
      },
      {
        text: "1, 2",
        isCorrect: false,
        explanation:
          "Statement 1 is true, but statement 2 is false and statement 3 is missing. Paging does not create external fragmentation because any free frame can hold any page.",
      },
      {
        text: "2, 3",
        isCorrect: false,
        explanation:
          "Statement 3 is true, but statement 2 is false and statement 1 is missing. The TLB is a central paging optimization because it avoids repeated page-table walks for hot translations.",
      },
    ],
  },

  "2024-resit-q13": {
    question: "Which of the following conditions must be satisfied for a deadlock to occur?",
    correctIndex: 3,
    correctAnswer: "mutual exclusive",
    options: [
      {
        text: "preemptive",
        isCorrect: false,
        explanation:
          "Deadlock requires no preemption: resources cannot simply be taken away and reassigned safely. A preemptive resource model tends to break one of the necessary Coffman conditions.",
      },
      {
        text: "non-circular wait",
        isCorrect: false,
        explanation:
          "The necessary condition is circular wait, where each process in a cycle waits for a resource held by the next process. Non-circular wait is the opposite of that condition.",
      },
      {
        text: "all of the mentioned",
        isCorrect: false,
        explanation:
          "This cannot be right because 'preemptive' and 'non-circular wait' are not deadlock conditions. The relevant conditions are mutual exclusion, hold-and-wait, no preemption, and circular wait.",
      },
      {
        text: "mutual exclusive",
        isCorrect: true,
        explanation:
          "This option refers to mutual exclusion: at least one resource must be non-shareable, so only one process can use it at a time. Without any mutually exclusive resource, the resource conflict needed for deadlock would not arise.",
      },
    ],
  },

  "2024-resit-q14": {
    question: "Mutual exclusion can be provided by using __________.",
    correctIndex: 1,
    correctAnswer: "either mutex locks or binary semaphores",
    options: [
      {
        text: "condition variables",
        isCorrect: false,
        explanation:
          "Condition variables are used to sleep and wake threads based on predicates, normally while paired with a mutex. They do not by themselves provide exclusive ownership of a critical section.",
      },
      {
        text: "either mutex locks or binary semaphores",
        isCorrect: true,
        explanation:
          "A mutex lock directly provides mutual exclusion, and a binary semaphore initialized to 1 can also allow only one thread into a critical section at a time. The combined option is therefore the most complete answer.",
      },
      {
        text: "mutex locks",
        isCorrect: false,
        explanation:
          "Mutex locks do provide mutual exclusion, but this option is incomplete because binary semaphores can also be used for the same purpose. The question asks for the best available alternative.",
      },
      {
        text: "binary semaphores",
        isCorrect: false,
        explanation:
          "A binary semaphore can provide mutual exclusion, but this option is also incomplete because mutex locks are the direct primitive for critical-section exclusion. The 'either' option covers both correct mechanisms.",
      },
    ],
  },

  "2024-resit-q15": {
    question: "Which of the following statements is TRUE about I/O devices?",
    correctIndex: 1,
    correctAnswer: "2, 3",
    options: [
      {
        text: "3",
        isCorrect: false,
        explanation:
          "DMA can transfer data between an I/O device and main memory without the CPU copying every byte, so statement 3 is true. However, statement 2 is true as well, so choosing only 3 is incomplete.",
      },
      {
        text: "2, 3",
        isCorrect: true,
        explanation:
          "Polling means the CPU repeatedly checks a device status register, so statement 2 is true. DMA lets the device controller move data to or from memory with much less CPU involvement after setup, so statement 3 is also true.",
      },
      {
        text: "1, 2, 3",
        isCorrect: false,
        explanation:
          "This includes statement 1, which is false. Memory-mapped I/O maps device registers into the address space so the CPU can use ordinary load/store instructions; special I/O instructions are associated with port-mapped I/O.",
      },
      {
        text: "2",
        isCorrect: false,
        explanation:
          "Polling does constantly check the target device's state, so statement 2 is true. The option is still incomplete because DMA's independent device-to-memory transfer in statement 3 is also true.",
      },
    ],
  },

  "2024-resit-q16": {
    question:
      "An old hard disk drive has RPM 5400, average seek 8 ms, and max transfer 100 MB/s. Which statement is correct?",
    correctIndex: 1,
    correctAnswer: "The average rotation latency of this HDD is 5.5ms.",
    options: [
      {
        text: "The transfer latency to read 1 MB file from this HDD is 1ms.",
        isCorrect: false,
        explanation:
          "At 100 MB/s, transferring 1 MB takes about 1/100 second, which is 10 ms, not 1 ms. This option confuses the transfer-rate calculation by a factor of ten.",
      },
      {
        text: "The average rotation latency of this HDD is 5.5ms.",
        isCorrect: true,
        explanation:
          "5400 RPM means 5400 rotations per minute, or 90 rotations per second. One full rotation takes about 11.1 ms, and average rotational latency is half a rotation, about 5.5 ms.",
      },
      {
        text: "The average latency to read 1MB file from this HDD is 29ms.",
        isCorrect: false,
        explanation:
          "The average read latency is average seek plus average rotation plus transfer time: 8 ms + 5.5 ms + 10 ms = 23.5 ms. The official solution uses this calculation, so 29 ms is too high.",
      },
      {
        text: "The rotation latency is dependent on the size of the accessed file.",
        isCorrect: false,
        explanation:
          "Rotational latency depends on disk rotational speed and where the desired sector is relative to the head when the request arrives. File size affects transfer time, not the average wait for the disk to rotate to the first sector.",
      },
    ],
  },

  "2024-resit-q17": {
    question: "Which of the following is CORRECT about Solid-state disks (SSDs)?",
    correctIndex: 3,
    correctAnswer: "SSDs use flash memory to store data.",
    options: [
      {
        text: "SSDs are more prone to physical damage due to their mechanical components.",
        isCorrect: false,
        explanation:
          "SSDs have no spinning platters or moving read/write heads, which is one reason they are generally more resistant to shock than HDDs. Mechanical fragility is an HDD issue, not an SSD property.",
      },
      {
        text: "The most basic unit in SSDs is a block.",
        isCorrect: false,
        explanation:
          "In NAND flash, reads and writes are typically page-based, while erasure happens at block granularity. Calling the block the most basic unit is therefore not the correct general statement for SSD operation.",
      },
      {
        text: "Both SSDs and HDDs use spinning disks to store data.",
        isCorrect: false,
        explanation:
          "HDDs store data magnetically on spinning platters. SSDs store data electronically in flash memory and do not use spinning disks.",
      },
      {
        text: "SSDs use flash memory to store data.",
        isCorrect: true,
        explanation:
          "SSDs store persistent data in non-volatile flash memory cells. Their controller manages flash-specific constraints such as erase-before-write, wear leveling, and garbage collection.",
      },
    ],
  },

  "2024-resit-q18": {
    question: "Which of the following is FALSE for files and directories?",
    correctIndex: 2,
    correctAnswer: "Two different files can have the same Inode number at the same time.",
    options: [
      {
        text: "A directory is a special file.",
        isCorrect: false,
        explanation:
          "In Unix-like file systems, a directory is represented as a special kind of file whose contents map names to inode numbers. Since the statement is true, it is not the false option.",
      },
      {
        text: "A path is a human readable name for a file.",
        isCorrect: false,
        explanation:
          "A path is the human-readable naming string used to locate a file or directory through the directory hierarchy. This is true at the abstraction level used in the question.",
      },
      {
        text: "Two different files can have the same Inode number at the same time.",
        isCorrect: true,
        explanation:
          "Within a file system, an inode number identifies one underlying file object. Multiple directory entries can hard-link to the same inode, but then they are names for the same file, not two different files. That is why this is the false statement.",
      },
      {
        text: "The assigned number of file descriptors usually starts from 3 because 0, 1, and 2 are reserved for standard input, output, and error.",
        isCorrect: false,
        explanation:
          "Unix-like processes conventionally start with file descriptors 0, 1, and 2 open as standard input, standard output, and standard error. The next newly opened descriptor is therefore usually 3, making this statement true.",
      },
    ],
  },
} satisfies ChoiceExplanationMap;

export default explanations2024Resit;
