<?php

namespace App\Jobs;

use App\Models\Hosthomerule;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldBeUnique;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Validator;

class UpdateRule implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public $tries = 3;

    public $retryAfter = 5;
    
    /**
     * Create a new job instance.
     *
     * @return void
     */
    public function __construct(
        private $hostHomeId,
        private array $rules,
    )
    {
        //
    }

    /**
     * Execute the job.
     *
     * @return void
     */
    public function handle()
    {
        $this->updateRules($this->hostHomeId, $this->rules);
    }

    private function updateRules($hosthome, array $rules)
    {

        foreach ($rules as $rule) {
            $existingRule = Hosthomerule::where('rule', $rule)
            ->where('host_home_id', $hosthome)
            ->first();

            if (!$existingRule) {
                $hosthomeruleData = ['rule' => $rule, 'host_home_id' => $hosthome];
                $this->createRules($hosthomeruleData);
            }
        }
    }
    
    public function createRules($data)
    {
        // Validate the input data
        $validator = Validator::make($data, [
            'rule' => 'string',
            'host_home_id' => 'exists:App\Models\HostHome,id'
        ]);
    
        // Check for validation errors
        if ($validator->fails()) {
            // Handle validation errors, you can return a response or throw an exception
            return response(['error' => $validator->errors()], 422);
        }
    
        $data2 = $validator->validated();
    
        return Hosthomerule::create($data2);
        
    }


}
